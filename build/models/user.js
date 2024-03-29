'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _helpers = require('../config/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class User {

    constructor() {}

    createUserQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated) {

        'use strict';

        user_uuid = _helpers2.default.checkifUndefined(user_uuid);
        first_name = _helpers2.default.checkifUndefined(first_name);
        last_name = _helpers2.default.checkifUndefined(last_name);
        username = _helpers2.default.checkifUndefined(username);
        other_name = _helpers2.default.checkifUndefined(other_name);
        email = _helpers2.default.checkifUndefined(email);
        phone_number = _helpers2.default.checkifUndefined(phone_number);
        gender = _helpers2.default.checkifUndefined(gender);
        dob = _helpers2.default.checkifUndefined(dob);
        profile_completeness = _helpers2.default.checkifUndefined(profile_completeness);
        photo_url = _helpers2.default.checkifUndefined(photo_url);
        social_media_id = _helpers2.default.checkifUndefined(social_media_id);
        tagline = _helpers2.default.checkifUndefined(tagline);
        password = _helpers2.default.checkifUndefined(password);
        is_activated = _helpers2.default.checkifUndefined(is_activated);

        let date_created = this.getCurrentTimeStamp();

        password = _bcryptjs2.default.hashSync(password, _config2.default.salt_rounds);

        let sql = `INSERT INTO user(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, \
        dob, profile_completeness, photo_url, social_media_id, tagline, password, date_created, is_activated, is_first_login)\
         VALUES ('${user_uuid}',\
        '${first_name}', '${last_name}', '${username}','${other_name}', '${email}', '${phone_number}', '${gender}',\
        '${dob}', '${profile_completeness}', '${photo_url}', '${social_media_id}', '${tagline}', '${password}',\
        '${date_created}', '${is_activated}', '${_config2.default.true}')`;

        return sql;
    }

    createTeammateQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated, company_id) {

        'use strict';

        user_uuid = _helpers2.default.checkifUndefined(user_uuid);
        first_name = _helpers2.default.checkifUndefined(first_name);
        last_name = _helpers2.default.checkifUndefined(last_name);
        username = _helpers2.default.checkifUndefined(username);
        other_name = _helpers2.default.checkifUndefined(other_name);
        email = _helpers2.default.checkifUndefined(email);
        phone_number = _helpers2.default.checkifUndefined(phone_number);
        gender = _helpers2.default.checkifUndefined(gender);
        dob = _helpers2.default.checkifUndefined(dob);
        profile_completeness = _helpers2.default.checkifUndefined(profile_completeness);
        photo_url = _helpers2.default.checkifUndefined(photo_url);
        social_media_id = _helpers2.default.checkifUndefined(social_media_id);
        tagline = _helpers2.default.checkifUndefined(tagline);
        password = _helpers2.default.checkifUndefined(password);
        is_activated = _helpers2.default.checkifUndefined(is_activated);

        let date_created = this.getCurrentTimeStamp();

        password = _bcryptjs2.default.hashSync(password, _config2.default.salt_rounds);

        let sql = `INSERT INTO user(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, \
        dob, profile_completeness, photo_url, social_media_id, tagline, password, date_created, is_activated, is_first_login,\
        company, is_password_set) VALUES ('${user_uuid}',\
        '${first_name}', '${last_name}', '${username}','${other_name}', '${email}', '${phone_number}', '${gender}',\
        '${dob}', '${profile_completeness}', '${photo_url}', '${social_media_id}', '${tagline}', '${password}',\
        '${date_created}', '${is_activated}', '${_config2.default.false}', ${company_id}, '${_config2.default.false}')`;

        return sql;
    }

    createCompanyQuery(company_name, industry, no_of_employees, year_established, type_of_employer, rc_number, facebook_link, instagram_link, twitter_link, google_plus_link, youtube_channel_link, linkedin_link, website, address, country, state, company_phone_number, company_email, company_logo, company_banner_img_url, created_by) {

        company_name = _helpers2.default.checkifUndefined(company_name);
        industry = _helpers2.default.checkifUndefined(industry);
        no_of_employees = _helpers2.default.checkifUndefined(no_of_employees);
        year_established = _helpers2.default.checkifUndefined(year_established);
        type_of_employer = _helpers2.default.checkifUndefined(type_of_employer);
        rc_number = _helpers2.default.checkifUndefined(rc_number);
        facebook_link = _helpers2.default.checkifUndefined(facebook_link);
        twitter_link = _helpers2.default.checkifUndefined(twitter_link);
        instagram_link = _helpers2.default.checkifUndefined(instagram_link);
        google_plus_link = _helpers2.default.checkifUndefined(google_plus_link);
        linkedin_link = _helpers2.default.checkifUndefined(linkedin_link);
        youtube_channel_link = _helpers2.default.checkifUndefined(youtube_channel_link);
        company_phone_number = _helpers2.default.checkifUndefined(company_phone_number);
        company_email = _helpers2.default.checkifUndefined(company_email);
        website = _helpers2.default.checkifUndefined(website);
        country = _helpers2.default.checkifUndefined(country);
        address = _helpers2.default.checkifUndefined(address);
        state = _helpers2.default.checkifUndefined(state);
        company_banner_img_url = _helpers2.default.checkifUndefined(company_banner_img_url);
        company_logo = _helpers2.default.checkifUndefined(company_logo);

        let date_created = this.getCurrentTimeStamp();

        let sql = `INSERT INTO company(company_name, industry, no_of_employees, year_established, type_of_employer,\
         rc_number, facebook_link, instagram_link, twitter_link, google_plus_link, youtube_channel_link, linkedin_link,\
         website, address, country, state, company_phone_number, company_email, company_logo_url, date_created, \
         company_banner_img_url, created_by) VALUES ('${company_name}', ${industry}, '${no_of_employees}', '${year_established}', \
         '${type_of_employer}', '${rc_number}', '${facebook_link}', '${instagram_link}', '${twitter_link}', '${google_plus_link}', \
         '${youtube_channel_link}', '${linkedin_link}', '${website}', '${address}', ${country}, ${state}, \
         '${company_phone_number}', '${company_email}', '${company_logo}', '${date_created}', '${company_banner_img_url}',\
         ${created_by})`;

        return sql;
    }

    static insertUserRole(user_id, role_id) {
        let sql = `INSERT INTO user_role(user_id, role_id) VALUES (${user_id}, ${role_id})`;
        return sql;
    }

    static addCompanyToRecruiter(user_id, company_id) {
        let sql = `UPDATE user SET company = ${company_id} WHERE user_id = ${user_id}`;
        return sql;
    }

    updateCandidateQuery(user_id, first_name, last_name, email, phone_number, address, gender, dob, tagline, state, country, industry) {

        first_name = _helpers2.default.checkifUndefined(first_name);
        last_name = _helpers2.default.checkifUndefined(last_name);
        email = _helpers2.default.checkifUndefined(email);
        phone_number = _helpers2.default.checkifUndefined(phone_number);
        address = _helpers2.default.checkifUndefined(address);
        gender = _helpers2.default.checkifUndefined(gender);
        dob = _helpers2.default.checkifUndefined(dob);
        tagline = _helpers2.default.checkifUndefined(tagline);
        industry = _helpers2.default.checkifUndefined(industry);

        state = typeof state === 'undefined' && state == 'null' && state == null && state == '' ? 0 : state;
        country = typeof country === 'undefined' && country == 'null' && country == null && country == '' ? 0 : country;

        let sql = `UPDATE user SET first_name='${first_name}', last_name='${last_name}',\
            email='${email}', phone_number='${phone_number}', address='${address}', \
            gender='${gender}', dob='${dob}', tagline='${tagline}', state=${state}, \
            country=${country}, industry=${industry} WHERE user_id = ${user_id}`;

        return sql;
    }

    updateRecruiterQuery(user_id, first_name, last_name, email, phone_number) {

        first_name = _helpers2.default.checkifUndefined(first_name);
        last_name = _helpers2.default.checkifUndefined(last_name);
        email = _helpers2.default.checkifUndefined(email);
        phone_number = _helpers2.default.checkifUndefined(phone_number);

        let sql = `UPDATE user SET first_name='${first_name}', last_name='${last_name}',\
                email='${email}', phone_number='${phone_number}' WHERE user_id = ${user_id}`;

        return sql;
    }

    updateRecruiterCompany(company_id, company_name, rc_number, industry, no_of_employees, year_established, type_of_employer, facebook_link, instagram_link, twitter_link, google_plus_link, linkedin_link, youtube_channel_link, phone_number, company_email, website, country, address, city, state, company_logo_url, company_banner_img_url, company_description) {

        company_name = _helpers2.default.checkifUndefined(company_name);
        rc_number = _helpers2.default.checkifUndefined(rc_number);
        industry = _helpers2.default.checkifUndefined(industry);
        no_of_employees = _helpers2.default.checkifUndefined(no_of_employees);
        year_established = _helpers2.default.checkifUndefined(year_established);
        type_of_employer = _helpers2.default.checkifUndefined(type_of_employer);
        facebook_link = _helpers2.default.checkifUndefined(facebook_link);
        instagram_link = _helpers2.default.checkifUndefined(instagram_link);
        twitter_link = _helpers2.default.checkifUndefined(twitter_link);
        google_plus_link = _helpers2.default.checkifUndefined(google_plus_link);
        linkedin_link = _helpers2.default.checkifUndefined(linkedin_link);
        youtube_channel_link = _helpers2.default.checkifUndefined(youtube_channel_link);
        phone_number = _helpers2.default.checkifUndefined(phone_number);
        company_email = _helpers2.default.checkifUndefined(company_email);
        website = _helpers2.default.checkifUndefined(website);
        country = _helpers2.default.checkifUndefined(country);
        address = _helpers2.default.checkifUndefined(address);
        city = _helpers2.default.checkifUndefined(city);
        state = _helpers2.default.checkifUndefined(state);
        company_logo_url = _helpers2.default.checkifUndefined(company_logo_url);
        company_banner_img_url = _helpers2.default.checkifUndefined(company_banner_img_url);

        company_description = _helpers2.default.escapeString(company_description);
        company_description = _helpers2.default.checkifUndefined(company_description);

        let sql = `UPDATE company SET company_name = '${company_name}', industry = ${industry}, \
            no_of_employees = '${no_of_employees}', year_established = '${year_established}', \
            type_of_employer = '${type_of_employer}', rc_number = '${rc_number}', \
            facebook_link = '${facebook_link}', instagram_link = '${instagram_link}', \
            twitter_link = '${twitter_link}', google_plus_link = '${google_plus_link}', \
            youtube_channel_link = '${youtube_channel_link}', linkedin_link = '${linkedin_link}',\
            website = '${website}', address = '${address}', city = '${city}', country = ${country}, \
            state = ${state}, company_phone_number = '${phone_number}',company_email = '${company_email}', \
            company_logo_url = '${company_logo_url}', company_banner_img_url = '${company_banner_img_url}', \
            company_description = '${company_description}' WHERE company_id = ${company_id}`;

        return sql;
    }

    static updatePasswordQuery(user_id, password) {
        password = _bcryptjs2.default.hashSync(password, _config2.default.salt_rounds);

        let sql = `UPDATE user SET password='${password}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static updateInvitedUserInfo(user_id, first_name, last_name, password) {
        password = _bcryptjs2.default.hashSync(password, _config2.default.salt_rounds);

        let sql = `UPDATE user SET first_name = '${first_name}', last_name = '${last_name}', \
                password='${password}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static updatePasswordForUser(user_id, password) {
        password = _bcryptjs2.default.hashSync(password, _config2.default.salt_rounds);

        let sql = `UPDATE user SET password='${password}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static getUserPasswordQuery(user_id) {
        let sql = `SELECT password FROM user WHERE user_id = ${user_id}`;

        return sql;
    }

    static getUserByIdQuery(user_id) {
        let sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
        return sql;
    }

    static checkIfUserExistsBySocialMediaId(social_media_id) {
        let sql = `SELECT * FROM user WHERE social_media_id = ${social_media_id}`;
        return sql;
    }

    static checkIfEmailExist(email) {
        let sql = `SELECT u.user_id, u.first_name, u.last_name, u.password, ur.role_id FROM \
            user u, user_role ur WHERE LOWER(email) = LOWER('${email}') AND u.user_id = ur.user_id`;

        return sql;
    }

    static getCandidateData(user_id) {
        let sql = `SELECT u.*, ur.role_id, r.resume_id FROM user u, user_role ur, resume r \
            WHERE u.user_id = ${user_id} AND u.user_id = ur.user_id \
            AND u.user_id = r.user_id`;

        return sql;
    }

    static getAdminData(user_id) {
        let sql = `SELECT u.*, ur.role_id FROM user u, user_role ur \
            WHERE u.user_id = ${user_id} AND u.user_id = ur.user_id`;

        return sql;
    }

    static getRecruiterData(user_id) {
        let sql = `SELECT u.*, ur.role_id, c.company_id, c.company_name FROM \
            user u, user_role ur, company c WHERE u.user_id = ${user_id} \
            AND u.user_id = ur.user_id AND u.company = c.company_id`;

        return sql;
    }

    static getUserRoleByUserId(user_id) {
        let sql = `SELECT role_id FROM user_role WHERE user_id = ${user_id}`;

        return sql;
    }

    static loginQuery(email) {
        let sql = `SELECT u.*, ur.role_id FROM user u, user_role ur WHERE u.email = '${email}' \
        AND ur.user_id = u.user_id`;

        return sql;
    }

    static addPasswordTokenToUser(user_id, token) {
        let sql = `UPDATE user SET token = '${token}' WHERE user_id = ${user_id}`;
        return sql;
    }

    static deleteUserByIdQuery(user_id) {
        let sql = `DELETE FROM user WHERE user_id = ${user_id}`;
        return sql;
    }

    static getAllUsersQuery() {
        let sql = `SELECT * FROM user`;
        return sql;
    }

    static loginQuery(email, password) {
        let sql = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`;
        return sql;
    }

    saveUserActivationToken(user_id, token) {
        let sql = `UPDATE user SET activation_token = '${token}' WHERE user_id = ${user_id}`;

        return sql;
    }

    compareUserActivationToken(user_id, token) {
        let sql = `SELECT * FROM user WHERE activation_token = '${token}' AND user_id = ${user_id}`;

        return sql;
    }

    activateUser(user_id) {
        let sql = `UPDATE user SET is_activated ='1' WHERE user_id = ${user_id}`;

        return sql;
    }

    getUserActivityHistory(user_id) {
        let sql = `SELECT * FROM activity_trail WHERE user_id = ${user_id} \
                    ORDER BY date_created DESC LIMIT 7`;

        return sql;
    }

    getCountOfCandidateApplications(user_id) {
        let sql = `SELECT COUNT(*) AS count FROM application WHERE user_id = ${user_id}`;

        return sql;
    }

    getCountOfCandidateSavedJobs(user_id) {
        let sql = `SELECT COUNT(*) AS count FROM saved_jobs WHERE saved_by = ${user_id}`;

        return sql;
    }

    getCountOfJobOpenings(user_id) {
        let sql = `SELECT COUNT(*) AS count FROM job WHERE posted_by = ${user_id}\
                 AND is_deleted = ${_config2.default.false}`;

        return sql;
    }

    getCountOfTotalQualifiedCandidates(user_id) {
        let sql = `SELECT COUNT(*) AS count FROM application WHERE job_id IN (SELECT job_id FROM\
                 job WHERE posted_by = ${user_id}) AND application_status = '${_config2.default.shortlisted}'`;

        return sql;
    }

    getCountOfRecruiterSavedCandidates(user_id) {
        let sql = `SELECT COUNT(*) AS count FROM saved_resumes WHERE user_id = ${user_id}`;

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

    updateResumeFileUrlQuery(user_id, resume_id, resume_url) {
        let sql = `UPDATE resume SET resume_file_url = '${resume_url}' WHERE resume_id = ${resume_id} \
                    AND user_id = ${user_id}`;

        return sql;
    }

    updateProfilePicQuery(user_id, photo_url) {
        let sql = `UPDATE user SET photo_url = '${photo_url}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static getAllCompanyTeamMembersByCompanyId(company_id) {
        let sql = `SELECT u.*, ur.role_id, r.role_name FROM user u, user_role ur \
                    INNER JOIN role r ON ur.role_id = r.role_id \
                    WHERE u.company = ${company_id} AND u.user_id = ur.user_id`;

        return sql;
    }

    static getUserByInviteToken(invite_token) {
        let sql = `SELECT u.*, ur.role_id FROM user u, user_role ur WHERE invite_token = '${invite_token}' \
                AND u.user_id = ur.user_id`;
        return sql;
    }

    static getUserByPasswordResetToken(password_reset_token) {
        let sql = `SELECT u.*, ur.role_id FROM user u, user_role ur WHERE password_reset_token = '${password_reset_token}' \
                AND u.user_id = ur.user_id`;
        return sql;
    }

    saveInviteToken(recipient_email, token) {
        let sql = `UPDATE user SET invite_token = '${token}', is_invite_token_active = ${_config2.default.true} \
                WHERE email = '${recipient_email}'`;
        return sql;
    }

    savePasswordResetToken(user_id, token) {
        let sql = `UPDATE user SET password_reset_token = '${token}' WHERE user_id = ${user_id}`;
        return sql;
    }

    deactivateInviteToken(user_id) {
        let sql = `UPDATE user SET is_invite_token_active = ${_config2.default.false} WHERE user_id = ${user_id}`;
        return sql;
    }

    deactivatePasswordResetToken(user_id) {
        let sql = `UPDATE user SET is_password_reset_token_active = ${_config2.default.false} WHERE user_id = ${user_id}`;
        return sql;
    }

    getAllActiveCandidates() {
        let sql = `SELECT u.user_id, u.first_name, u.last_name, u.email \
                FROM user u WHERE \
                (SELECT ur.role_id FROM user_role ur WHERE ur.user_id = u.user_id) = 1`;

        return sql;
    }

    getAllRecruitersSavedCandidates(user_id) {
        let sql = `SELECT sr.saved_resume_id, u.*, r.* FROM saved_resumes sr \
            INNER JOIN user u ON sr.user_id = u.user_id \
            INNER JOIN resume r ON sr.resume_id = r.resume_id \
            WHERE sr.created_by = ${user_id}`;

        return sql;
    }

    getAllCandidatesSavedJobs(user_id) {
        let sql = `SELECT sj.saved_job_id, j.job_id, j.job_name, \
                (SELECT c.company_name FROM company c WHERE c.company_id = j.company_id) AS company_name, \
                (SELECT cty.country_name FROM country cty WHERE cty.country_id = j.country_id) AS country, \
                (SELECT s.state_name FROM state s WHERE s.state_id = j.state_id) AS state, \
                (SELECT jt.job_type_name FROM job_type jt WHERE jt.job_type_id = j.job_type_id) AS job_type, \
                (SELECT jc.job_category_name FROM job_category jc WHERE jc.job_category_id = j.job_category_id) AS job_category \
                FROM saved_jobs sj \
                INNER JOIN job j ON sj.job_id = j.job_id \
                WHERE sj.saved_by = ${user_id}`;

        return sql;
    }

    removeSavedCandidate(candidate_id, recruiter_user_id) {
        let sql = `DELETE FROM saved_resumes WHERE user_id = ${candidate_id} \
            AND created_by = ${recruiter_user_id}`;

        return sql;
    }

    getAllRecruitersInterviews(user_id) {
        let sql = `SELECT i.*, \
            (SELECT COUNT(*) FROM application a WHERE a.job_id = i.job_id \
            AND a.application_status = ${_config2.default.ap_status_interview}) AS no_of_candidates \
            FROM interview i WHERE i.created_by = ${user_id} \
            ORDER BY i.date_created DESC`;

        return sql;
    }

    getInterviewByInterviewId(interviewId) {
        let sql = `SELECT * FROM interview WHERE interview_id = ${interviewId}`;

        return sql;
    }

    getAllCandidatesForInterview(interview_id, job_id) {
        let sql = `SELECT a.*, u.*, j.*, a.date_created AS application_date \
                FROM application a \
                INNER JOIN job j ON a.job_id = j.job_id \
                INNER JOIN user u ON a.user_id = u.user_id \
                WHERE a.job_id = ${job_id} \
                AND a.application_status = ${_config2.default.ap_status_interview}`;

        return sql;
    }

    static createInterview(interview_name, interview_date, interview_time, venue, dress_code, job_assigned_to, interview_description, user_id) {

        interview_name = _helpers2.default.checkifUndefined(interview_name);
        interview_date = _helpers2.default.checkifUndefined(interview_date);
        interview_time = _helpers2.default.checkifUndefined(interview_time);
        venue = _helpers2.default.checkifUndefined(venue);
        dress_code = _helpers2.default.checkifUndefined(dress_code);
        job_assigned_to = _helpers2.default.checkifUndefined(job_assigned_to);

        interview_description = _helpers2.default.escapeString(interview_description);
        interview_description = _helpers2.default.checkifUndefined(interview_description);

        interview_date = _helpers2.default.formatDateToDatetime(interview_date);

        let date_created = _helpers2.default.getCurrentTimeStamp();

        let sql = `INSERT INTO interview(interview_name, interview_date, interview_time, venue, dress_code, \
            description, job_id, created_by, is_deleted, status, date_created) VALUES ('${interview_name}', \
            '${interview_date}', '${interview_time}', '${venue}', '${dress_code}', '${interview_description}', \
            ${job_assigned_to}, ${user_id}, ${_config2.default.false}, '${_config2.default.opened}', '${date_created}')`;

        return sql;
    }

    updateProfilePictureUrlQuery(user_id, profile_pic_url) {
        let sql = `UPDATE user SET photo_url = '${profile_pic_url}' WHERE user_id = ${user_id}`;

        return sql;
    }

    getAllSettingForProfilePercentage() {
        let sql = `SELECT setting_name, setting_value AS value FROM setting WHERE setting_name LIKE '%pp%'`;

        return sql;
    }

    saveProfilePercentage(user_id, profile_percentage) {
        let sql = `UPDATE user SET profile_completeness = '${profile_percentage}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static getProfilePercentage(user_id) {
        let sql = `SELECT profile_completeness FROM user WHERE user_id = ${user_id}`;

        return sql;
    }

    getCompanyInfoByCompanyId(company_id) {
        let sql = `SELECT * FROM company WHERE company_id = ${company_id}`;

        return sql;
    }

    getCandidateCV(user_id) {
        let sql = `SELECT r.resume_file_url FROM resume r WHERE user_id = ${user_id}`;

        return sql;
    }

}

exports.default = User;