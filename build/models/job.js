'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _session_store = require('./../config/session_store');

var _session_store2 = _interopRequireDefault(_session_store);

var _helpers = require('./../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _log4js = require('./../config/log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Job {

    constructor() {}

    createJobQuery(job_title, company_id, default_country_id, job_type, job_category, location, industry, job_description, job_responsibilities, min_qualification, experience_level, min_year_of_experience, max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age, required_skills, shortlist_params, user_id) {

        job_title = _helpers2.default.escapeString(job_title);
        job_title = this.checkifUndefined(job_title);

        company_id = this.checkifUndefined(company_id);
        default_country_id = this.checkifUndefined(default_country_id);
        job_type = this.checkifUndefined(job_type);
        job_category = this.checkifUndefined(job_category);
        location = this.checkifUndefined(location);
        industry = this.checkifUndefined(industry);

        job_description = _helpers2.default.escapeString(job_description);
        job_description = this.checkifUndefined(job_description);

        job_responsibilities = _helpers2.default.escapeString(job_responsibilities);
        job_responsibilities = this.checkifUndefined(job_responsibilities);

        min_qualification = this.checkifUndefined(min_qualification);
        experience_level = this.checkifUndefined(experience_level);
        min_year_of_experience = this.checkifUndefined(min_year_of_experience);
        max_year_of_experience = this.checkifUndefined(max_year_of_experience);
        expected_salary = this.checkifUndefined(expected_salary);
        gender_type = this.checkifUndefined(gender_type);
        application_deadline = this.formatDateUsingDateTime(this.checkifUndefined(application_deadline));
        minimum_age = this.checkifUndefined(minimum_age);
        maximum_age = this.checkifUndefined(maximum_age);
        required_skills = this.checkifUndefined(required_skills);
        shortlist_params = this.checkifUndefined(shortlist_params);

        let date_created = this.getCurrentTimeStamp();

        let sql = `INSERT INTO job(job_name, company_id, country_id, job_type_id, job_category_id, state_id, \
            industry, job_description, job_responsibilities, min_qualification, experience_level_id, \
            min_year_of_experience, max_year_of_experience, expected_salary, gender_type, \
            application_deadline, min_age, max_age, date_created, posted_by, status, shortlist_params, \
            required_skills, is_deleted) VALUES ('${job_title}','${company_id}','${default_country_id}',\
            '${job_type}','${job_category}','${location}','${industry}','${job_description}',\
            '${job_responsibilities}','${min_qualification}','${experience_level}','${min_year_of_experience}',\
            '${max_year_of_experience}','${expected_salary}','${gender_type}','${application_deadline}',\
            '${minimum_age}','${maximum_age}','${date_created}','${user_id}','${_config2.default.active}',\
            '${shortlist_params}','${required_skills}','${_config2.default.false}')`;

        return sql;
    }

    static saveJobQuery(job_id, user_id) {
        let sql = `INSERT INTO saved_jobs(job_id, saved_by) VALUES (${job_id}, ${user_id})`;
        return sql;
    }

    removeSavedJob(saved_job_id) {
        let sql = `DELETE FROM saved_jobs WHERE saved_job_id = ${saved_job_id}`;

        return sql;
    }

    applyForJobQuery(job_id, user_id, cover_letter, additional_resume_url) {
        job_id = this.checkifUndefined(job_id);
        user_id = this.checkifUndefined(user_id);

        cover_letter = _helpers2.default.escapeString(cover_letter);
        cover_letter = this.checkifUndefined(cover_letter);

        additional_resume_url = this.checkifUndefined(additional_resume_url);

        let date_created = this.getCurrentTimeStamp();

        let application_status = _config2.default.not_shortlisted;

        /*
               
                let result = this.shortlistingProcess(user_id, job_id);
        
                if(result){
                    application_status = config.shortlisted;
                } else{
                    application_status = config.declined;
                } */

        let sql = `INSERT INTO application (job_id, user_id, date_created, cover_letter, additional_resume_url, \
            application_status) VALUES \
        (${job_id}, ${user_id}, '${date_created}', '${cover_letter}', '${additional_resume_url}', '${application_status}')`;

        return sql;
    }

    static getJobByIdQuery(job_id) {
        let sql = `SELECT j.*, c.company_name, c.website, c.company_logo_url, c.address,\
                c.company_description, co.country_name, co.country_code, s.state_name, \
                jc.job_category_name, jt.job_type_name, el.experience_level_name, \
                q.qualification_name AS min_qualification_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                INNER JOIN qualification q ON j.min_qualification = q.qualification_id \
                WHERE job_id = ${job_id} AND is_deleted = '${_config2.default.false}'`;

        return sql;
    }

    static getJobNameByIdQuery(job_id) {
        let sql = `SELECT job_name FROM job WHERE job_id = ${job_id} \
            AND is_deleted = '${_config2.default.false}'`;

        return sql;
    }

    static getApplicationsByStatusQuery(application_status) {
        let sql = `SELECT * FROM application WHERE application_status = '${application_status}'`;

        return sql;
    }

    updateApplicationStatusQuery(application_id, application_status) {
        let sql = `UPDATE application set application_status = '${application_status}' \
        WHERE application_id = ${application_id}`;

        return sql;
    }

    updateApplicationStateQuery(application_id, application_state) {
        let sql = `UPDATE application set application_state = '${application_state}' \
        WHERE application_id = ${application_id}`;

        return sql;
    }

    checkIfUserAppliedToJob(job_id, user_id) {
        job_id = this.checkifUndefined(job_id);
        user_id = this.checkifUndefined(user_id);

        let sql = `SELECT COUNT(*) AS count FROM application WHERE job_id = ${job_id} AND user_id = ${user_id}`;

        return sql;
    }

    editJobPostQuery(job_id, job_title, job_type, job_category, location, industry, job_description, job_responsibilities, min_qualification, experience_level, min_year_of_experience, max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age, required_skills, shortlist_params) {

        job_title = _helpers2.default.escapeString(job_title);
        job_title = this.checkifUndefined(job_title);

        //company_id = this.checkifUndefined(company_id);
        //default_country_id = this.checkifUndefined(default_country_id);
        job_type = this.checkifUndefined(job_type);
        job_category = this.checkifUndefined(job_category);
        location = this.checkifUndefined(location);
        industry = this.checkifUndefined(industry);

        job_description = _helpers2.default.escapeString(job_description);
        job_description = this.checkifUndefined(job_description);

        job_responsibilities = _helpers2.default.escapeString(job_responsibilities);
        job_responsibilities = this.checkifUndefined(job_responsibilities);

        min_qualification = this.checkifUndefined(min_qualification);
        experience_level = this.checkifUndefined(experience_level);
        min_year_of_experience = this.checkifUndefined(min_year_of_experience);
        max_year_of_experience = this.checkifUndefined(max_year_of_experience);
        expected_salary = this.checkifUndefined(expected_salary);
        gender_type = this.checkifUndefined(gender_type);
        application_deadline = this.checkifUndefined(application_deadline);
        minimum_age = this.checkifUndefined(minimum_age);
        maximum_age = this.checkifUndefined(maximum_age);
        required_skills = this.checkifUndefined(required_skills);
        shortlist_params = this.checkifUndefined(shortlist_params);

        let date_updated = this.getCurrentTimeStamp();

        let sql = `UPDATE job SET job_name='${job_title}', job_type_id=${job_type}, job_category_id=${job_category}, \
                state_id=${location}, industry=${industry}, job_description='${job_description}', \
                job_responsibilities='${job_responsibilities}', min_qualification='${min_qualification}', \
                experience_level_id=${experience_level}, min_year_of_experience='${min_year_of_experience}', \
                max_year_of_experience='${max_year_of_experience}', expected_salary='${expected_salary}', gender_type='${gender_type}', \
                application_deadline='${application_deadline}', min_age='${minimum_age}', max_age='${maximum_age}', \
                required_skills='${required_skills}', shortlist_params='${shortlist_params}', date_updated='${date_updated}' \
                WHERE job_id = ${job_id}`;

        return sql;
    }

    static deleteJobByIdQuery(job_id) {
        let sql = `UPDATE job SET is_deleted = '${_config2.default.true}' WHERE job_id = ${job_id}`;
        return sql;
    }

    expireJobQuery(job_id) {
        let sql = `UPDATE job SET status = '${_config2.default.expired}' WHERE job_id = ${job_id}`;

        return sql;
    }

    static getAllJobsQuery() {
        let sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.is_deleted = '${_config2.default.false}' AND j.application_deadline >= CURDATE() \
                ORDER BY j.date_created DESC`;
        return sql;
    }

    static searchJobsQuery(keyword, location) {

        let params = { "keyword": keyword, "industry": keyword, "state": location, "country": location };

        let conditions = Job.buildSearchConditions(params);

        let sql = `SELECT DISTINCT j.* FROM job j, state s, country c WHERE ` + conditions.where + ` AND j.is_deleted = '${_config2.default.false}'`;

        _log4js2.default.log("sql: " + sql);
        return sql;
    }

    static keywordSearch(keyword) {
        let sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, 
                jt.job_type_name, el.experience_level_name FROM job j 
                INNER JOIN company c ON j.company_id = c.company_id 
                INNER JOIN country co ON j.country_id = co.country_id 
                INNER JOIN state s ON j.state_id = s.state_id 
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id 
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id 
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id 
                WHERE is_deleted = '0'
                
                AND LOWER(j.job_name) LIKE LOWER('%${keyword}%')
                OR LOWER(j.job_description) LIKE LOWER('%${keyword}%')
                OR LOWER(j.job_responsibilities) LIKE LOWER('%${keyword}%')
                OR LOWER(j.required_skills) LIKE LOWER('%${keyword}%')
                ORDER BY j.date_created DESC`;

        return sql;
    }

    static getRecruiterLast5PostedJobs(user_id) {
        let sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, 
                jt.job_type_name, el.experience_level_name, 
                (SELECT COUNT(*) FROM application a WHERE a.job_id = j.job_id) AS no_of_applications 
                FROM job j 
                INNER JOIN company c ON j.company_id = c.company_id 
                INNER JOIN country co ON j.country_id = co.country_id 
                INNER JOIN state s ON j.state_id = s.state_id 
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id 
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id 
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id 
                WHERE is_deleted = '0' AND posted_by = ${user_id} ORDER BY j.date_created DESC LIMIT 5`;

        return sql;
    }

    static getAllRecruiterPostedJobs(user_id) {
        let sql = `SELECT j.job_id, j.job_name, j.date_created, j.application_deadline, \
                j.status, jt.job_type_name, \
                (SELECT COUNT(*) FROM application a WHERE a.job_id = j.job_id) AS no_of_applications \
                FROM job j \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                WHERE is_deleted = '0' AND posted_by = ${user_id} ORDER BY j.date_created DESC`;

        return sql;
    }

    static getCountOfJobApplication(job_id) {
        let sql = `SELECT COUNT(*) AS count FROM application WHERE job_id = ${job_id}`;

        return sql;
    }

    static searchJobsByLocationQuery(location) {
        let params = { "state": location, "country": location };

        let conditions = Job.buildLocationSearchConditions(params);

        let sql = `SELECT DISTINCT * FROM state s, country c WHERE ` + conditions.where;

        return sql;
    }

    static getAllJobApplicants(job_id) {
        let sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.* FROM application a
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id}`;

        return sql;
    }

    static getAllShortlistedJobApplicants(job_id) {
        let sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.* FROM application a
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id} AND a.application_status = '${_config2.default.ap_status_shortlisted}'`;

        return sql;
    }

    static getAllNonShortlistedJobApplicants(job_id) {
        let sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.* FROM application a
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id} AND a.application_status = '${_config2.default.not_shortlisted}'`;

        return sql;
    }

    static getAllJobApplicantsForExcel(job_id) {
        let sql = `SELECT a.application_status, a.date_created AS date_applied, u.user_id,\
            u.first_name, u.last_name, u.email, u.phone_number FROM application a \
            INNER JOIN user u ON a.user_id = u.user_id \
            WHERE a.job_id = ${job_id}`;

        return sql;
    }

    static getAllShortlistedJobApplicantsForExcel(job_id) {
        let sql = `SELECT a.application_status, a.date_created AS date_applied, u.user_id, \
            u.first_name, u.last_name, u.email, u.phone_number FROM application a \
            INNER JOIN user u ON a.user_id = u.user_id \
            WHERE a.job_id = ${job_id} AND a.application_status = '${_config2.default.ap_status_shortlisted}'`;

        return sql;
    }

    static getAllNonShortlistedJobApplicantsForExcel(job_id) {
        let sql = `SELECT a.application_status, a.date_created AS date_applied, u.user_id, \
            u.first_name, u.last_name, u.email, u.phone_number FROM application a \
            INNER JOIN user u ON a.user_id = u.user_id \
            WHERE a.job_id = ${job_id} AND a.application_status = '${_config2.default.not_shortlisted}'`;

        return sql;
    }

    getUserResumeByUserId(user_id) {
        let sql = `SELECT * FROM resume WHERE user_id = ${user_id}`;

        return sql;
    }

    getAllShortlistParams(job_id) {
        let sql = `SELECT shortlist_params FROM job WHERE job_id = ${job_id}`;

        return sql;
    }

    static buildSearchConditions(params) {
        var conditions = [];

        if (typeof params.keyword !== 'undefined') {
            conditions.push(`LOWER(j.job_name) LIKE LOWER('%${params.keyword}%') OR \
           LOWER(j.job_description) LIKE LOWER('%${params.keyword}%')`);
        }

        if (typeof params.country !== 'undefined') {
            conditions.push(`c.country_id = '${params.country}'`);
        }

        if (typeof params.state !== 'undefined') {
            conditions.push(`s.state_id = '${params.state}'`);
        }

        return {
            where: conditions.length ? conditions.join(' AND ') : '1'

        };
    }

    static buildLocationSearchConditions(params) {
        var conditions = [];

        if (typeof params.country !== 'undefined') {
            conditions.push(`c.country_id = '${params.country}'`);
        }

        if (typeof params.state !== 'undefined') {
            conditions.push(`s.state_id = '${params.state}'`);
        }

        return {
            where: conditions.length ? conditions.join(' AND ') : '1'

        };
    }

    static dynamicUpdateQuery() {
        let whereData = [['user_id', 3], ['is_deleted', 0], ['phone_number', '08687989448']];
        let data = [['fullname', 'tobi'], ['email', 't@y.com'], ['phone_number', '08687989448']];
        let operation = 'or';
        let text = '';
        let where = '';
        let refinedData,
            refinedWhereData = "";

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length; j += 3) {
                refinedData = `'${data[i][j]}' = '${data[i][j + 1]}'`;

                _log4js2.default.log(`REFINED: '${data[i][j]}' = '${data[i][j + 1]}'`);
            }
            text += refinedData + ', ';
        }

        for (var i = 0; i < whereData.length; i++) {
            for (var j = 0; j < whereData.length; j += 3) {
                refinedWhereData = `'${whereData[i][j]}' = '${whereData[i][j + 1]}'`;

                _log4js2.default.log(`REFINED-WHERE: '${whereData[i][j]}' = '${whereData[i][j + 1]}'`);
            }
            where += refinedWhereData + operation;
        }

        let sql = `UPDATE user SET ${text} WHERE ${where}`;
        _log4js2.default.log(sql);

        return sql;
    }

    checkifUndefined(value) {
        if (typeof value === 'undefined') {
            return null;
        } else {
            return value;
        }
    }

    getCurrentTimeStamp() {
        let dt = _nodeDatetime2.default.create();
        let date_created = dt.format('Y-m-d H:M:S');

        return date_created;
    }

    formatDateUsingDateTime(dateToFormat) {
        let dt = _nodeDatetime2.default.create(dateToFormat);

        return dt.format('Y-m-d H:M:S');
    }

    shortlistingProcess(user_id, job_id) {
        'use strict';

        let isShortlisted = false;
        let getShortlistParamQuery = `SELECT shortlist_params FROM job WHERE job_id = ${job_id}`;

        _database2.default.query(getShortlistParamQuery, (err, data) => {
            if (!err) {
                let paramString = data[0].shortlist_params;
                let params = paramString.split(',');

                if (params.includes(_config2.default.age_shortlist_param_code)) {

                    var result = this.calculateAgeForShortlist(user_id, job_id);
                }

                if (params.includes(_config2.default.qualification_shortlist_param_code)) {
                    let isShortlisted = this.calculateQualificationForShortlist(user_id, job_id);

                    _log4js2.default.log("qualification shortlist_result - " + isShortlisted);
                }
                if (params.includes(_config2.default.yoe_shortlist_param_code)) {
                    let isShortlisted = this.calculateYearOfExperienceForShortlist(user_id, job_id);

                    _log4js2.default.log("YOE shortlist_result - " + isShortlisted);
                }
                if (params.includes(_config2.default.gender_shortlist_param_code)) {
                    let isShortlisted = this.calculateGenderForShortlist(user_id, job_id);

                    _log4js2.default.log("Gender shortlist_result - " + isShortlisted);
                }

                _log4js2.default.log(params);
            } else {
                _log4js2.default.log(err);
            }
        });
    }

    newShortlistProcess(res, user_id, job_id) {
        let getShortlistParamQuery = `SELECT shortlist_params FROM job WHERE job_id = ${job_id}`;

        _database2.default.query(getShortlistParamQuery, (err, data) => {
            if (!err) {
                let paramString = data[0].shortlist_params;
                let params = paramString.split(',');

                if (params.length > 0) {
                    _log4js2.default.log(params);

                    this.startShortlistProcess(res, user_id, job_id, params);
                } else {
                    res.status(200).json({
                        message: "Shortlist Status",
                        shortlistStatus: true
                    });
                }
            } else {
                _log4js2.default.log(err);
            }
        });
    }

    startShortlistProcess(res, user_id, job_id, params) {
        this.calculateAgeForShortlist(res, user_id, job_id, params);
    }

    calculateAgeFromDOB(dob) {
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
            age--;
        }
        return age;
    }

    calculateAgeForShortlist(res, user_id, job_id, params) {
        if (params.includes(_config2.default.age_shortlist_param_code)) {
            let sql = `SELECT u.dob, j.min_age, j.max_age FROM user u, job j WHERE \
                u.user_id = ${user_id} AND j.job_id = ${job_id}`;

            _database2.default.query(sql, (err, data) => {

                if (!err) {
                    let dob = data[0].dob;

                    if (dob && typeof dob != 'undefined' && dob != 'null' && dob != '' && dob != null) {
                        let user_age = this.calculateAgeFromDOB(data[0].dob);

                        let min_age = data[0].min_age;
                        let max_age = data[0].max_age;

                        if (user_age >= min_age && user_age <= max_age) {
                            console.log('AGE - true');
                            this.calculateYearOfExperienceForShortlist(res, user_id, job_id, params);
                        } else {
                            console.log('AGE - false (doesnt fit)');

                            res.status(200).json({
                                message: "Shortlist Status",
                                shortlistStatus: false
                            });
                        }
                    } else {
                        console.log('AGE - false (no age)');
                        res.status(200).json({
                            message: "Shortlist Status",
                            shortlistStatus: false
                        });
                    }
                }
            });
        } else {
            this.calculateYearOfExperienceForShortlist(res, user_id, job_id, params);
        }
    }

    calculateYearOfExperienceForShortlist(res, user_id, job_id, params) {
        if (params.includes(_config2.default.yoe_shortlist_param_code)) {
            let sql = `SELECT we.start_date, we.end_date, we.user_id, j.min_year_of_experience, j.max_year_of_experience \
                FROM work_experience we, job j WHERE j.job_id = ${job_id} AND we.user_id = ${user_id}`;

            _database2.default.query(sql, (err, data) => {
                if (!err) {
                    let job_min_year_of_experience = parseInt(data[0].min_year_of_experience);
                    let job_max_year_of_experience = parseInt(data[0].max_year_of_experience);

                    let no_of_years = [];
                    let users_total_no_of_experience = 0;

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].start_date && data[i].end_date) {
                            let start_date = (0, _moment2.default)(data[i].start_date, 'YYYY-MM-DD');
                            let end_date = (0, _moment2.default)(data[i].end_date, 'YYYY-MM-DD');

                            no_of_years.push(this.calculateYearBetweenTwoDates(start_date, end_date));
                            users_total_no_of_experience += no_of_years[i];
                        }
                    }

                    if (users_total_no_of_experience > 0) {
                        if (users_total_no_of_experience >= job_min_year_of_experience && users_total_no_of_experience <= job_max_year_of_experience) {

                            console.log('YOE - true');
                            this.calculateQualificationForShortlist(res, user_id, job_id, params);
                        } else {
                            console.log('YOE - false (doesnt fit)');
                            res.status(200).json({
                                message: "Shortlist Status",
                                shortlistStatus: false
                            });
                        }
                    } else {
                        console.log('YOE - false (no experience)');
                        res.status(200).json({
                            message: "Shortlist Status",
                            shortlistStatus: false
                        });
                    }
                }
            });
        } else {
            this.calculateQualificationForShortlist(res, user_id, job_id, params);
        }
    }

    calculateQualificationForShortlist(res, user_id, job_id, params) {
        if (params.includes(_config2.default.qualification_shortlist_param_code)) {
            let sql = `SELECT j.min_qualification, e.qualification, e.qualification_grade FROM \
                job j, education e WHERE j.job_id = ${job_id} AND e.user_id = ${user_id}`;

            _database2.default.query(sql, (err, data) => {
                if (!err) {
                    let job_min_qualification = data[0].min_qualification;

                    let user_qualifications = [];
                    let user_qualification_grade = [];

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].qualification) {
                            user_qualifications.push(parseInt(data[i].qualification));
                            user_qualification_grade.push(data[i].qualification_grade);
                        }
                    }

                    if (user_qualifications.length > 0) {
                        let highest_user_qualification = Math.max.apply(Math, user_qualifications);

                        if (highest_user_qualification >= job_min_qualification) {
                            console.log('QUALIFICATION - true');
                            this.calculateGenderForShortlist(res, user_id, job_id, params);
                        } else {
                            console.log('QUALIFICATION - false (doesnt fit)');
                            res.status(200).json({
                                message: "Shortlist Status",
                                shortlistStatus: false
                            });
                        }
                    } else {
                        console.log('QUALIFICATION - false (no qualification)');
                        res.status(200).json({
                            message: "Shortlist Status",
                            shortlistStatus: false
                        });
                    }
                }
            });
        } else {
            this.calculateGenderForShortlist(res, user_id, job_id, params);
        }
    }

    calculateGenderForShortlist(res, user_id, job_id, params) {
        if (params.includes(_config2.default.gender_shortlist_param_code)) {
            let sql = `SELECT u.gender, j.gender_type FROM user u, job j \
                WHERE j.job_id = ${job_id} AND u.user_id = ${user_id}`;

            _database2.default.query(sql, (err, data) => {
                if (!err) {
                    let user_gender = data[0].gender;
                    let job_gender_type = data[0].gender_type;

                    if (user_gender && typeof user_gender != 'undefined' && user_gender != 'null' && user_gender != '' && user_gender != null) {

                        if (job_gender_type === _config2.default.gender_status_all) {
                            console.log('GENDER - true');
                            res.status(200).json({
                                message: "Shortlist Status",
                                shortlistStatus: true
                            });
                        } else if (user_gender === job_gender_type) {
                            console.log('GENDER - true');
                            res.status(200).json({
                                message: "Shortlist Status",
                                shortlistStatus: true
                            });
                        } else {
                            console.log('GENDER - false (doesnt fit)');
                            res.status(200).json({
                                message: "Shortlist Status",
                                shortlistStatus: false
                            });
                        }
                    } else {
                        console.log('GENDER - false (no gender)');
                        res.status(200).json({
                            message: "Shortlist Status",
                            shortlistStatus: false
                        });
                    }
                }
            });
        } else {
            res.status(200).json({
                message: "Shortlist Status",
                shortlistStatus: true
            });
        }
    }

    calculateYearBetweenTwoDates(first_date, second_date) {
        let no_of_years = _moment2.default.duration(second_date - first_date).years();
        return no_of_years;
    }

    jobRecommendationProcess(user_id, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualification(user_id, function (err, data) {
            if (err) {
                _log4js2.default.log("ERROR : ", err);
            } else {
                _log4js2.default.log("result from qual query is : " + data.length);

                let jobsByQualification = data;

                //Get recommended jobs by gender
                let job = new Job();
                job.getJobsByUsersGender(user_id, function (err, data) {
                    let allUsersRecommendedJobs;

                    if (err) {
                        _log4js2.default.log("ERROR : ", err);
                    } else {
                        _log4js2.default.log("result from gender db is : ", data.length);

                        let jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);
                    }

                    callback(null, _helpers2.default.sortRecommendedJobsArray(allUsersRecommendedJobs));
                });
            }
        });
    }

    jobRecommendationProcessForDashboard(user_id, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualificationForDashboard(user_id, function (err, data) {
            if (err) {
                _log4js2.default.log("ERROR : ", err);
            } else {
                _log4js2.default.log("result from qual query is : " + data.length);

                let jobsByQualification = data;

                //Get recommended jobs by gender
                let job = new Job();
                job.getJobsByUsersGenderForDashboard(user_id, function (err, data) {
                    let allUsersRecommendedJobs;

                    if (err) {
                        _log4js2.default.log("ERROR : ", err);
                    } else {
                        _log4js2.default.log("result from gender db is : ", data.length);

                        let jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);
                    }

                    callback(null, _helpers2.default.sortRecommendedJobsArray(allUsersRecommendedJobs));
                });
            }
        });
    }

    jobRecommendationProcessWithFilter(user_id, filter, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualificationWithFilter(user_id, filter, function (err, data) {
            if (err) {
                _log4js2.default.log("ERROR : ", err);
            } else {
                _log4js2.default.log("result from qual query is : " + data.length);

                let jobsByQualification = data;

                //Get recommended jobs by gender
                let job = new Job();
                job.getJobsByUsersGenderWithFilter(user_id, filter, function (err, data) {
                    let allUsersRecommendedJobs;

                    if (err) {
                        _log4js2.default.log("ERROR : ", err);
                    } else {
                        _log4js2.default.log("result from gender db is : ", data.length);

                        let jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);
                    }

                    callback(null, _helpers2.default.sortRecommendedJobsArray(allUsersRecommendedJobs));
                });
            }
        });
    }

    jobRecommendationsCount(user_id, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualification(user_id, function (err, data) {
            if (err) {
                _log4js2.default.log("ERROR : ", err);
            } else {
                _log4js2.default.log("result from qual query is : " + data.length);

                let jobsByQualification = data;

                //Get recommended jobs by gender
                let job = new Job();
                job.getJobsByUsersGender(user_id, function (err, data) {
                    let allUsersRecommendedJobs;

                    if (err) {
                        _log4js2.default.log("ERROR : ", err);
                    } else {
                        _log4js2.default.log("result from gender db is : ", data.length);

                        let jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);
                    }

                    let count = _helpers2.default.sortRecommendedJobsArray(allUsersRecommendedJobs).length;

                    callback(null, count);
                });
            }
        });
    }

    getJobsByUsersGender(user_id, callback) {
        let sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name, \
                (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                a.job_id = j.job_id) AS application_status
                FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.application_deadline >= CURDATE() \
                AND LOWER(j.gender_type) = LOWER("All") OR \
                LOWER(j.gender_type) = LOWER((SELECT u.gender from user u where u.user_id = ${user_id})) \
                ORDER BY j.date_created DESC`;

        _database2.default.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersGenderWithFilter(user_id, filter, callback) {
        let sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name, \
                (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                a.job_id = j.job_id) AS application_status
                FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.application_deadline >= CURDATE() \
                AND (LOWER(j.gender_type) = LOWER("All") OR \
                LOWER(j.gender_type) = LOWER((SELECT u.gender from user u where u.user_id = ${user_id})))`;

        if (typeof filter != 'undefined' && filter) {
            sql += ` AND j.job_type_id = ${filter}`;
        }

        sql += ` ORDER BY j.date_created DESC`;

        _database2.default.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersQualification(user_id, callback) {
        let sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                    co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name, \
                    (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) AS application_status
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND min_qualification <= (SELECT MAX(qualification) AS user_qualification FROM education \
                    WHERE user_id = ${user_id}) ORDER BY j.date_created DESC`;

        _database2.default.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersQualificationWithFilter(user_id, filter, callback) {
        let sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                    co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name, \
                    (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) AS application_status
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND min_qualification <= (SELECT MAX(qualification) AS user_qualification FROM education \
                    WHERE user_id = ${user_id})`;

        if (typeof filter != 'undefined' && filter) {
            sql += ` AND j.job_type_id = ${filter}`;
        }

        sql += ` ORDER BY j.date_created DESC`;

        _database2.default.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersGenderForDashboard(user_id, callback) {
        let sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name, \
                (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                a.job_id = j.job_id) AS application_status
                FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.application_deadline >= CURDATE() \
                AND LOWER(j.gender_type) = LOWER("All") OR \
                LOWER(j.gender_type) = LOWER((SELECT u.gender from user u where u.user_id = ${user_id})) \
                ORDER BY j.date_created DESC LIMIT 10`;

        _database2.default.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersQualificationForDashboard(user_id, callback) {
        let sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                    co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name, \
                    (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) AS application_status
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND min_qualification <= (SELECT MAX(qualification) AS user_qualification FROM education \
                    WHERE user_id = ${user_id}) ORDER BY j.date_created DESC LIMIT 10`;

        _database2.default.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    get5RecommendedJobs(user_id) {
        let sql = `SELECT j.job_id, j.job_name, c.company_name, c.company_logo_url, \
                    co.country_name, s.state_name, jc.job_category_name, jt.job_type_name \
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) != 1 \
                    ORDER BY j.date_created DESC LIMIT 5`;

        return sql;
    }

    get10LatestJobs() {
        let sql = `SELECT j.job_id, j.job_name, c.company_name, c.company_logo_url, \
                    co.country_name, s.state_name, jc.job_category_name, jt.job_type_name \
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    WHERE j.application_deadline >= CURDATE() \
                    ORDER BY j.date_created DESC LIMIT 10`;

        return sql;
    }

    static getAllIndustries() {
        let sql = `SELECT * FROM industry`;

        return sql;
    }

    static getAllStates() {
        let sql = `SELECT * FROM state`;

        return sql;
    }

    static getAllQualifications() {
        let sql = `SELECT * FROM qualification`;

        return sql;
    }

    static getAllExperienceLevel() {
        let sql = `SELECT * FROM experience_level`;

        return sql;
    }

    static getAllSpecialization() {
        let sql = `SELECT * FROM specialization`;

        return sql;
    }

    static getAllSkill() {
        let sql = `SELECT skill_name AS label, value FROM skill`;

        return sql;
    }

    static getAllShortlistParams() {
        let sql = `SELECT param_name AS label, value FROM shortlist_params`;

        return sql;
    }

    static getAllPostedJobsToBeAssigned(user_id) {
        let sql = `SELECT job_name AS label, job_id AS value FROM job WHERE posted_by = ${user_id} \
                AND is_deleted = ${_config2.default.false}`;

        return sql;
    }

    static getAllApplicationStatus() {
        let sql = `SELECT * FROM application_status`;

        return sql;
    }

    static getAllCandidateJobApplications(user_id) {
        let sql = `SELECT a.application_id, a.date_created, j.job_id, j.job_name, \
                (SELECT aps.status_name FROM application_status aps WHERE \
                aps.application_status_id = a.application_status) AS application_status, \
                (SELECT c.company_name FROM company c WHERE c.company_id = j.company_id) AS company_name, \
                (SELECT jt.job_type_name FROM job_type jt WHERE jt.job_type_id = j.job_type_id) AS job_type \
                FROM application a INNER JOIN job j ON j.job_id = a.job_id \
                WHERE a.user_id = ${user_id} ORDER BY a.date_created DESC`;

        return sql;
    }

    static getCandidateApplicationStatus(candidate_id, job_id) {
        let sql = `SELECT * FROM application a WHERE a.user_id = ${candidate_id} \
                AND a.job_id = ${job_id}`;

        return sql;
    }

    static setApplicationStatus(applicant_status, personal_message, candidate_id, job_id) {
        let sql = `UPDATE application SET application_status = '${applicant_status}', \
                personal_message = '${personal_message}' WHERE job_id = ${job_id} AND \
                user_id = ${candidate_id}`;

        return sql;
    }

    static getAllCountries() {
        let sql = `SELECT * FROM country`;

        return sql;
    }

    static getAllJobTypes() {
        let sql = `SELECT * FROM job_type`;

        return sql;
    }

    static getAllJobCategories() {
        let sql = `SELECT * FROM job_category`;

        return sql;
    }

    static getAllSkills() {
        let sql = `SELECT * FROM skill`;

        return sql;
    }

    getFilterJobsProcessQuery(industry_params, skills_params, state_params, job_type_params, job_category_params) {
        let sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE is_deleted = '${_config2.default.false}' AND j.application_deadline >= CURDATE()`;

        if (typeof industry_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND c.industry IN (' + industry_params.join() + ')';
        }

        if (typeof skills_params == 'undefined') {
            sql += '';
        } else {
            sql += '';
        }

        if (typeof state_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND j.state_id IN (' + state_params.join() + ')';
        }

        if (typeof job_type_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND j.job_type_id IN (' + job_type_params.join() + ')';
        }

        if (typeof job_category_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND j.job_category_id IN (' + job_category_params.join() + ')';
        }

        sql += ' ORDER BY j.date_created DESC';

        return sql;
    }

    processJobsByQualification(all_recommended_jobs_array, recommended_jobs_by_qualification) {
        for (let i = 0; i < recommended_jobs_by_qualification.length; i++) {
            if (!removeDuplicateJobs(all_recommended_jobs_array, recommended_jobs_by_qualification[i])) {
                all_recommended_jobs_array.push(recommended_jobs_by_qualification[i]);
            }
        }
        _log4js2.default.log(recommended_jobs_by_qualification);
        return all_recommended_jobs_array;
    }

    removeDuplicateJobs(mainArray, secondaryArray) {
        return mainArray.includes(secondaryArray);
    }

    searchTagline(param) {
        let sql = `SELECT DISTINCT u.* FROM user u \
                WHERE LOWER(u.tagline) LIKE LOWER('%${param}%')`;

        return sql;
    }

    searchWERolename(param) {
        let sql = `SELECT DISTINCT u.* FROM user u
                WHERE u.user_id IN (SELECT we.user_id FROM \
                work_experience we WHERE LOWER(we.job_title) \
                LIKE LOWER('%${param}%'))`;

        return sql;
    }

    searchState(param) {
        let sql = `SELECT DISTINCT u.* FROM user u \ 
                WHERE u.state IN (${param})`;

        return sql;
    }

    searchCountry(param) {
        let sql = `SELECT DISTINCT u.* FROM user u \ 
                WHERE u.country IN (${param})`;

        return sql;
    }

    searchQualification(param) {
        let sql = `SELECT DISTINCT u.* FROM user u \
                WHERE u.user_id IN (SELECT e.user_id FROM \
                education e WHERE e.qualification = ${param})`;

        return sql;
    }

    searchSkill(param) {
        let sql = `SELECT DISTINCT u.* FROM user u WHERE u.user_id IN \
                (SELECT rs.user_id FROM resume_skill rs WHERE rs.skill_id IN \
                (SELECT s.skill_id FROM skill s WHERE LOWER(s.skill_name) \
                LIKE LOWER('%${param}%')))`;

        return sql;
    }

    searchIndustry(param) {
        let sql = `SELECT DISTINCT u.* FROM user u \
                WHERE u.user_id IN (SELECT e.user_id FROM \
                education e WHERE e.qualification IN (${param}))`;

        return sql;
    }

    searchCompany(param) {
        let sql = `SELECT DISTINCT u.* FROM user u WHERE u.company IN (SELECT c.company_id \
                FROM company c WHERE LOWER(c.company_name) LIKE LOWER('%${param}%'))`;

        return sql;
    }

    searchEducationName(param) {
        let sql = `SELECT DISTINCT u.* FROM user u WHERE u.user_id IN \
                (SELECT e.user_id FROM education e WHERE LOWER(e.name_of_institution) \
                LIKE LOWER('%${param}%'))`;

        return sql;
    }

    searchTalentPool(job_title_param, keyword_param, location_param, education_level_param) {
        let sql = `SELECT DISTINCT u.user_id, u.user_uuid, u.first_name, u.last_name, u.tagline, u.photo_url, \
                 r.profile_summary FROM user u INNER JOIN resume r ON r.user_id = u.user_id \
                 WHERE u.is_deleted = 0`;

        if (typeof job_title_param != 'undefined' && job_title_param && job_title_param != '') {
            sql += ` AND \
                    (LOWER(u.tagline) LIKE LOWER('%${job_title_param}%') \
                    OR \
                    u.user_id IN (SELECT we.user_id FROM work_experience we WHERE LOWER(we.job_title) \
                    LIKE LOWER('%${job_title_param}%'))
                    OR \
                    u.user_id IN (SELECT r.user_id FROM resume r WHERE LOWER(r.profile_summary) \
                    LIKE LOWER('%${job_title_param}%')))`;
        }

        if (typeof keyword_param != 'undefined' && keyword_param && keyword_param != '') {
            sql += ` AND \
                    (u.user_id IN (SELECT e.user_id FROM education e WHERE LOWER(e.name_of_institution) \
                    LIKE LOWER('%${keyword_param}%')) \
                    OR \
                    u.user_id IN (SELECT rs.user_id FROM resume_skill rs WHERE rs.skill_id IN \
                    (SELECT s.skill_id FROM skill s WHERE LOWER(s.skill_name) LIKE LOWER('%${keyword_param}%'))))`;
        }

        if (typeof location_param != 'undefined' && location_param && location_param != '') {
            sql += ` AND \
                    (u.state IN (${location_param}) \
                    OR \
                    u.country IN (${location_param}))`;
        }

        if (typeof education_level_param != 'undefined' && education_level_param && education_level_param != '') {
            sql += ` AND \
                     u.user_id IN (SELECT e.user_id FROM education e WHERE e.qualification IN (${education_level_param}))`;
        }

        return sql;
    }

    percentageMatchProcess(user_id, job_id) {
        let qualification_score = 10;
        let experience_score = 10;
        let gender_score = 10;
        let age_score = 10;

        let total_score = 0;

        let qualification_sql = `SELECT job.min_qualification, education.qualification, \
            education.qualification_grade FROM job AS job, education AS education \
            WHERE job.job_id = ${job_id} AND education.user_id = ${user_id}`;

        _database2.default.query(qualification_sql, (err, data) => {
            if (!err) {
                let job_min_qualification = data[0].min_qualification;

                let user_qualifications = [];
                let user_qualification_grade = [];

                for (let i = 0; i < data.length; i++) {
                    user_qualifications.push(parseInt(data[i].qualification));
                    user_qualification_grade.push(data[i].qualification_grade);
                }

                let highest_user_qualification = Math.max.apply(Math, user_qualifications);

                if (highest_user_qualification >= job_min_qualification) {
                    total_score += qualification_score;
                }

                let experience_sql = `SELECT WE.start_date, WE.end_date, WE.user_id, \
                    job.min_year_of_experience, job.max_year_of_experience FROM work_experience AS WE, \
                    job AS job WHERE job.job_id = ${job_id} AND WE.user_id = ${user_id}`;

                _database2.default.query(experience_sql, (err, data) => {
                    if (!err) {
                        let job_min_year_of_experience = parseInt(data[0].min_year_of_experience);
                        let job_max_year_of_experience = parseInt(data[0].max_year_of_experience);

                        let no_of_years = [];
                        let users_total_no_of_experience = 0;

                        for (let i = 0; i < data.length; i++) {
                            let start_date = (0, _moment2.default)(data[i].start_date, 'YYYY-MM-DD');
                            let end_date = (0, _moment2.default)(data[i].end_date, 'YYYY-MM-DD');

                            no_of_years.push(this.calculateYearBetweenTwoDates(start_date, end_date));
                            users_total_no_of_experience += no_of_years[i];
                        }

                        if (users_total_no_of_experience >= job_min_year_of_experience && users_total_no_of_experience <= job_max_year_of_experience) {

                            total_score += experience_score;
                        }

                        let gender_sql = `SELECT user.gender, job.gender_type FROM user, job WHERE job_id = ${job_id} AND user_id = ${user_id}`;

                        _database2.default.query(gender_sql, (err, data) => {
                            if (!err) {
                                let user_gender = data[0].gender;
                                let job_gender_type = data[0].gender_type;

                                if (job_gender_type === _config2.default.gender_status_all) {
                                    total_score += gender_score;
                                } else if (user_gender === job_gender_type) {
                                    total_score += gender_score;
                                }

                                let age_sql = `SELECT user.dob AS dob, job.min_age, job.max_age FROM user AS user, \
                                    job AS job WHERE user.user_id = ${user_id} AND job.job_id = ${job_id}`;

                                _database2.default.query(age_sql, (err, data) => {

                                    if (!err) {
                                        let dob = data[0].dob;

                                        if (typeof dob != 'undefined' || dob != 'null' || dob != '' || dob != null) {
                                            let user_age = this.calculateAgeFromDOB(data[0].dob);

                                            let min_age = data[0].min_age;
                                            let max_age = data[0].max_age;

                                            if (user_age >= min_age && user_age <= max_age) {
                                                total_score += age_score;
                                            }
                                        }
                                    }

                                    return total_score;
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

exports.default = Job;