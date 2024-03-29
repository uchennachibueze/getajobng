"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _database = require("../db/database");

var _database2 = _interopRequireDefault(_database);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

var _job = require("./../models/job");

var _job2 = _interopRequireDefault(_job);

var _resume = require("./../models/resume");

var _resume2 = _interopRequireDefault(_resume);

var _assessment = require("./../models/assessment");

var _assessment2 = _interopRequireDefault(_assessment);

var _v = require("uuid/v1");

var _v2 = _interopRequireDefault(_v);

var _config = require("../config/config");

var _config2 = _interopRequireDefault(_config);

var _excel = require("../config/excel");

var _excel2 = _interopRequireDefault(_excel);

var _session_store = require("../config/session_store");

var _session_store2 = _interopRequireDefault(_session_store);

var _helpers = require("../config/helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _mailer = require("../config/mail/mailer");

var _mailer2 = _interopRequireDefault(_mailer);

var _log4js = require("./../config/log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _azure_helpers = require("../config/azure_helpers");

var _azure_helpers2 = _interopRequireDefault(_azure_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.use((0, _cookieParser2.default)());
router.use(_bodyParser2.default.json());
router.use(_bodyParser2.default.urlencoded({ extended: false }));

router.use((0, _expressSession2.default)({
    secret: _config2.default.session_secret,
    resave: _config2.default.session_resave,
    key: _config2.default.session_key,
    saveUninitialized: _config2.default.session_save_uninitialized,
    cookie: { maxAge: _config2.default.session_cookie_max_age }
}));

router.get("/", (req, res, next) => {});

router.get('/dashboard', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_dashboard', {
        view: 'dashboard',
        data: userData
    });
});

router.get('/settings', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    let redirectFrom = req.query.f;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        //If redirect is from Update User Profile
        if (redirectFrom == 'u_p') {
            res.render('recruiter_settings', {
                view: 'settings',
                data: userData,
                userInfo: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Profile Successfully Updated' : 'Profile couldn\'t update',
                alertType: response == 's' ? 'success' : 'error'
            });
        }

        if (redirectFrom == 'u_cp') {
            res.render('recruiter_settings', {
                view: 'settings',
                data: userData,
                userInfo: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Company Profile Updated Successfully' : 'Company Profile couldn\'t update',
                alertType: response == 's' ? 'success' : 'error'
            });
        }

        //If redirect is from Change user password
        else if (redirectFrom == 'p') {
                let message_to_show = '';

                if (response == 'p_s') {
                    message_to_show = 'Password changed successfully';
                } else if (response == 'p_e') {
                    message_to_show = 'An error occured changing your password';
                } else if (response == 'p_m') {
                    message_to_show = 'Your current password does not match with our records';
                } else if (response == 'i_p') {
                    message_to_show = 'Incorrect Password';
                }

                res.render('recruiter_settings', {
                    view: 'settings',
                    data: userData,
                    userInfo: userData,
                    showAlert: true,
                    alertMessage: message_to_show,
                    alertType: response == 'p_s' ? 'success' : 'error'
                });
            }

            //If redirect is from Add Team members
            else if (redirectFrom == 'a_t') {
                    let message_to_show = '';

                    if (response == 's') {
                        message_to_show = 'Team mates added successfully';
                    } else if (response == 'u_e') {
                        message_to_show = 'A user already exist with this email';
                    }

                    res.render('recruiter_settings', {
                        view: 'settings',
                        data: userData,
                        userInfo: userData,
                        showAlert: true,
                        alertMessage: message_to_show,
                        alertType: response == 's' ? 'success' : 'error'
                    });
                }
    } else {
        res.render('recruiter_settings', {
            view: 'settings',
            data: userData,
            userInfo: userData
        });
    }
});

router.post('/get-company-info', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let company_id = req.body.company_id;

    let user = new _user2.default();
    _database2.default.query(user.getCompanyInfoByCompanyId(company_id), (err, data) => {

        let companyInfo = data[0];

        if (!err) {
            res.status(200).json({
                message: "Company Information.",
                companyInfo: companyInfo
            });
        }
    });
});

router.get('/saved-candidates', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_saved_candidates', {
        view: 'saved-candidates',
        data: userData
    });
});

router.get('/get-all-saved-candidates', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getAllRecruitersSavedCandidates(user_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All Saved Candidates.",
                candidates: data
            });
        }
    });
});

router.get('/get-searched-talents', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    'use strict';
    let all_resume_info = [];

    let talents = _session_store2.default.getAllTalentSearchResults();

    _log4js2.default.log('$$$$$$$$$$ - talents - $$$$$$$$$$$$');
    _log4js2.default.log(talents.length);

    for (let i = 0; i < talents.length; i++) {
        _database2.default.query(_resume2.default.getResumeByUserIdQuery(talents[i].user_id), (err, data) => {
            if (err) {
                _log4js2.default.log(err);
            } else {
                let resume = data[0];
                let resume_id = data[0].resume_id;

                _log4js2.default.log("resume - ");
                _log4js2.default.log(resume);

                //Get all Candidate Educations
                _database2.default.query(_resume2.default.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                    if (err) {
                        _log4js2.default.log(err);
                    } else {
                        let education = data;
                        _log4js2.default.log("education - ");
                        _log4js2.default.log(education);

                        //Get all Candidate WEs
                        _database2.default.query(_resume2.default.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                            if (err) {
                                _log4js2.default.log(err);
                            } else {
                                let work_experience = data;
                                _log4js2.default.log("work_experience - ");
                                _log4js2.default.log(work_experience);

                                all_resume_info = [{
                                    resume_info: resume,
                                    education: education,
                                    work_experience: work_experience
                                }];

                                talents[i].resume_info = all_resume_info;
                            }
                        });
                    }
                });
            }
        });
    }

    res.status(200).json({
        message: "All searched talents.",
        talents: talents,
        resume_info: all_resume_info
    });
});

router.get('/talent-pool-old', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_talent_pool_old', {
        view: 'talent-pool',
        data: userData
    });
});

router.get('/talent-pool', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_talent_pool', {
        view: 'talent-pool',
        data: userData
    });
});

router.post('/go-to-search-talents', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let job_title = req.body.job_title;
    let keyword = req.body.keyword;
    let location = req.body.location;
    let education_level = req.body.education_level;

    res.redirect('/recruiters/talent-pool?job_title_param=' + job_title + '&keyword_param=' + keyword + '&location_param=' + location + '&education_param=' + education_level);
});

router.post('/search-talents', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let job_title = req.body.job_title;
    let keyword = req.body.keyword;
    let location = req.body.location;
    let education_level = req.body.education_level;

    let userData = req.session.passport.user;

    //searchTalents(job_title, keyword, location, education_level, res);
    newSearch(res, job_title, keyword, location, education_level);
});

function newSearch(res, job_title_search_param, keyword_search_param, location_search_param, education_level_search_param) {

    let job = new _job2.default();
    _database2.default.query(job.searchTalentPool(job_title_search_param, keyword_search_param, location_search_param, education_level_search_param), (err, data) => {
        if (!err) {
            _log4js2.default.log("result from query is : " + data.length);

            res.status(200).json({
                message: "All Talents.",
                talents: data
            });
        }
    });
}

function newSearchOld(job_title_search_param, keyword_search_param, location_search_param, education_level_search_param) {

    let job = new _job2.default();
    _database2.default.query(job.searchTagline(job_title_search_param), (err, data) => {
        if (!err) {
            _log4js2.default.log("result from tagline query is : " + data.length);

            let search_tagline_result = data;

            _database2.default.query(job.searchWERolename(job_title_search_param), (err, data) => {
                if (!err) {
                    _log4js2.default.log("result from WE Rolename query is : " + data.length);

                    let search_we_rolename_result = data;

                    _database2.default.query(job.searchSkill(keyword_search_param), (err, data) => {
                        if (!err) {
                            _log4js2.default.log("result from skill query is : " + data.length);

                            let search_skill_result = data;

                            _database2.default.query(job.searchCompany(keyword_search_param), (err, data) => {
                                if (!err) {
                                    _log4js2.default.log("result from company query is : " + data.length);

                                    let search_company_name_result = data;

                                    _database2.default.query(job.searchEducationName(keyword_search_param), (err, data) => {
                                        if (!err) {
                                            _log4js2.default.log("result from education name query is : " + data.length);

                                            let search_education_name_result = data;

                                            _database2.default.query(job.searchState(location_search_param), (err, data) => {
                                                if (!err) {
                                                    _log4js2.default.log("result from state query is : " + data.length);

                                                    let search_state_result = data;

                                                    _database2.default.query(job.searchCountry(location_search_param), (err, data) => {
                                                        if (!err) {
                                                            _log4js2.default.log("result from country query is : " + data.length);

                                                            let search_company_result = data;

                                                            _database2.default.query(job.searchQualification(education_level_search_param), (err, data) => {
                                                                if (!err) {
                                                                    _log4js2.default.log("result from qualification query is : " + data.length);

                                                                    let search_qualification_result = data;

                                                                    let all_search_result = [...search_tagline_result, ...search_we_rolename_result, ...search_skill_result, ...search_company_name_result, ...search_education_name_result, ...search_state_result, ...search_company_result, ...search_qualification_result];

                                                                    console.log('$$$$$$ all_search_result $$$$$');
                                                                    console.log(all_search_result.length);

                                                                    let sorted_result = _helpers2.default.sortUsersArray(all_search_result);

                                                                    console.log('$$$$$$ sorted_result $$$$$');
                                                                    console.log(sorted_result.length);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function searchJobTitles(job_title_search_param) {
    let job = new _job2.default();
    _database2.default.query(job.searchTagline(job_title_search_param), (err, data) => {
        if (!err) {
            _log4js2.default.log("result from tagline query is : " + data.length);

            _session_store2.default.saveTPTaglineSearchResults(data);

            _database2.default.query(job.searchWERolename(job_title_search_param), (err, data) => {
                if (!err) {
                    _log4js2.default.log("result from WE Rolename query is : " + data.length);

                    _session_store2.default.saveTPWERolenameSearchResults(data);
                }
                _session_store2.default.collateJobTitleSearchResults();
            });
        }
    });

    return;
}

function searchKeyword(keyword_search_param) {
    let job = new _job2.default();
    _database2.default.query(job.searchSkill(keyword_search_param), (err, data) => {
        if (!err) {
            _log4js2.default.log("result from skill query is : " + data.length);

            _session_store2.default.saveTPSkillSearchResults(data);

            _database2.default.query(job.searchCompany(keyword_search_param), (err, data) => {
                if (!err) {
                    _log4js2.default.log("result from company query is : " + data.length);

                    _session_store2.default.saveTPCompanySearchResults(data);

                    _database2.default.query(job.searchEducationName(keyword_search_param), (err, data) => {
                        if (!err) {
                            _log4js2.default.log("result from education name query is : " + data.length);

                            _session_store2.default.saveTPEduNameSearchResults(data);
                        }

                        _session_store2.default.collateKeywordSearchResults();
                    });
                }
            });
        }
    });

    //sessionStore.getAllKeywordSearchResults();

    return;
}

function searchLocations(location_search_param) {
    let job = new _job2.default();
    _database2.default.query(job.searchState(location_search_param), (err, data) => {
        if (!err) {
            _log4js2.default.log("result from state query is : " + data.length);

            _session_store2.default.saveTPStateSearchResults(data);

            _database2.default.query(job.searchCountry(location_search_param), (err, data) => {
                if (!err) {
                    _log4js2.default.log("result from country query is : " + data.length);

                    _session_store2.default.saveTPCountrySearchResults(data);
                }
                _session_store2.default.collateLocationSearchResults();
            });
        }
    });

    //sessionStore.getAllLocationSearchResults(); 

    return;
}

function searchEducationLevel(education_level_search_param) {
    let job = new _job2.default();
    _database2.default.query(job.searchQualification(education_level_search_param), (err, data) => {
        if (!err) {
            _log4js2.default.log("result from qualification query is : " + data.length);

            _session_store2.default.saveTPEducationLevelSearchResults(data);
        }
    });

    //sessionStore.getTPEducationLevelSearchResults(); 

    return;
}

router.get('/interviews', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    let redirectFrom = req.query.f;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        //If redirect is from Update User Profile
        if (redirectFrom == 'a_i') {
            res.render('recruiter_interviews', {
                view: 'interviews',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Interview Created Successfully' : 'An error occured. Please try again',
                alertType: response == 's' ? 'success' : 'error'
            });
        }
    } else {
        res.render('recruiter_interviews', {
            view: 'interviews',
            data: userData
        });
    }
});

router.get('/interviews/interview-detail/:interviewId', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let interviewId = req.params.interviewId;
    let userData = req.session.passport.user;

    let user = new _user2.default();
    _database2.default.query(user.getInterviewByInterviewId(interviewId), (err, data) => {
        if (!err) {
            let interview_data = data[0];

            interview_data.date_time_ago = _helpers2.default.getCurrentTimeAgo(interview_data.date_created);
            interview_data.date = _helpers2.default.formatDateTime(interview_data.date_created);

            res.render('recruiter_interview_detail', {
                view: 'interviews',
                data: userData,
                interview_data: interview_data
            });
        }
    });
});

router.get('/create-interview', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_create_interview', {
        view: 'interviews',
        data: userData
    });
});

router.get('/get-all-recruiters-interviews', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getAllRecruitersInterviews(user_id), (err, data) => {
        if (!err) {
            for (let i = 0; i < data.length; i++) {
                data[i].formatted_date = _helpers2.default.formatDateTime(data[i].date_created);
                data[i].interview_date = _helpers2.default.formatDateTime(data[i].interview_date);
            }
            res.status(200).json({
                message: "All Interviews.",
                interviews: data
            });
        }
    });
});

router.post('/get-all-candidates-for-interview', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let interview_id = req.body.interview_id;
    let job_id = req.body.job_id;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getAllCandidatesForInterview(interview_id, job_id), (err, data) => {
        if (!err) {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
                data[i].application_date = _helpers2.default.formatDateTime(data[i].application_date);
            }
            res.status(200).json({
                message: "All Candidates.",
                candidates: data
            });
        }
    });
});

router.post("/add-interview", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let interview_name = req.body.interview_name;
    let interview_date = req.body.interview_date;
    let interview_time = req.body.interview_time;
    let venue = req.body.venue;
    let dress_code = req.body.dress_code;
    let job_assigned_to = req.body.job_assigned_to;
    let interview_description = req.body.interview_description;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;
    let recipient_email = userData.email;
    let recipient_full_name = userData.first_name;

    _database2.default.query(_user2.default.createInterview(interview_name, interview_date, interview_time, venue, dress_code, job_assigned_to, interview_description, user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            if (data) {
                let interview_id = data.insertId;

                _helpers2.default.saveActivityTrail(user_id, "Interview Created", "You set an interview (" + interview_name + ") for " + interview_date + " by " + interview_time + ".");

                _mailer2.default.sendCreateInterviewMail(req, recipient_full_name, recipient_email, interview_id, interview_name, interview_date, interview_time);

                res.redirect('/recruiters/interviews?f=a_i&r=s');
            } else {
                res.redirect('/recruiters/interviews?f=a_i&r=e');
            }
        }
    });
});

router.get('/created-jobs', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_created_jobs', {
        view: 'created-jobs',
        data: userData
    });
});

router.get('/application-info/:jobId', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let job_id = req.params.jobId;
    let userData = req.session.passport.user;

    _database2.default.query(_job2.default.getJobByIdQuery(job_id), (err, data) => {
        if (!err) {
            let jobData = data[0];

            res.render('recruiter_job_applicants_info', {
                view: 'created-jobs',
                data: userData,
                jobData: jobData
            });
        }
    });
});

router.get('/all-job-candidates/:jobId', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let job_id = req.params.jobId;
    let userData = req.session.passport.user;

    _database2.default.query(_job2.default.getJobNameByIdQuery(job_id), (err, data) => {
        if (!err) {
            let job_name = data[0].job_name;

            res.render('recruiter_all_job_candidates', {
                view: 'created-jobs',
                data: userData,
                job_id: job_id,
                job_name: job_name
            });
        }
    });
});

router.get('/candidate-info/:userId', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    let user_id = req.params.userId;
    let job_id = req.query.l;

    job_id = typeof job_id != 'undefined' ? job_id : 0;

    //Get all user info initially
    _database2.default.query(_user2.default.getUserByIdQuery(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let userInfo = data[0];

            //Get Resume Info
            _database2.default.query(_resume2.default.getResumeByUserIdQuery(user_id), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                } else {
                    let resumeInfo = data[0];
                    let resume_id = resumeInfo.resume_id;

                    //Get all Candidate Educations
                    _database2.default.query(_resume2.default.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                        if (err) {
                            _log4js2.default.log(err);
                        } else {
                            let educationData = data;

                            //Get all Candidate WEs
                            _database2.default.query(_resume2.default.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                                if (err) {
                                    _log4js2.default.log(err);
                                } else {
                                    let workExperienceData = data;

                                    //Get all Candidate Certifications
                                    _database2.default.query(_resume2.default.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
                                        if (err) {
                                            _log4js2.default.log(err);
                                        } else {
                                            let certificationData = data;

                                            //Get all Candidate Certifications
                                            _database2.default.query(_resume2.default.getAllSkillByResumeIdQuery(resume_id), (err, data) => {
                                                if (err) {
                                                    _log4js2.default.log(err);
                                                } else {
                                                    let skillData = data;

                                                    //Get all Candidate Specializations
                                                    _database2.default.query(_resume2.default.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
                                                        if (err) {
                                                            _log4js2.default.log(err);
                                                        } else {
                                                            let specializationData = data;

                                                            //Get Candidate Application Status
                                                            _database2.default.query(_job2.default.getCandidateApplicationStatus(user_id, job_id), (err, data) => {
                                                                if (err) {
                                                                    _log4js2.default.log(err);
                                                                } else {
                                                                    let applicationData = data[0];

                                                                    let response = req.query.r;

                                                                    if (typeof response != 'undefined' && response) {
                                                                        res.render('recruiter_candidate_info', {
                                                                            view: 'created-jobs',
                                                                            data: userData,
                                                                            userInfo: userInfo,
                                                                            resumeInfo: resumeInfo,
                                                                            educationData: educationData,
                                                                            workExperienceData: workExperienceData,
                                                                            certificationData: certificationData,
                                                                            specializationData: specializationData,
                                                                            skillData: skillData,
                                                                            applicationData: applicationData,
                                                                            job_id: job_id,
                                                                            showAlert: true,
                                                                            alertMessage: response == 's' ? 'Candidate status changed' : 'Candidate Status not changed',
                                                                            alertType: response == 's' ? 'success' : 'error'
                                                                        });
                                                                    } else {
                                                                        res.render('recruiter_candidate_info', {
                                                                            view: 'created-jobs',
                                                                            data: userData,
                                                                            userInfo: userInfo,
                                                                            resumeInfo: resumeInfo,
                                                                            educationData: educationData,
                                                                            workExperienceData: workExperienceData,
                                                                            certificationData: certificationData,
                                                                            specializationData: specializationData,
                                                                            skillData: skillData,
                                                                            applicationData: applicationData,
                                                                            job_id: job_id
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post("/save-applicant-status", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let application_status = req.body.application_status;
    let personal_message = req.body.personal_message;
    let candidate_id = req.body.candidate_id;
    let job_id = req.body.job_id;

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    _database2.default.query(_job2.default.setApplicationStatus(application_status, personal_message, candidate_id, job_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            //helpers.saveActivityTrail(user_id, "Applicant Status Changed", "You saved a Job post with job_id - " + job_id);

            res.status(200).json({
                message: "Applicant Status saved"
            });
        }
    });
});

router.get('/post-a-job', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    let redirectFrom = req.query.f;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        if (redirectFrom == 'p_j') {
            res.render('recruiter_post_a_job', {
                view: 'post-a-job',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Job Posted Successfully' : 'An error occured. Please try again',
                alertType: response == 's' ? 'success' : 'error'
            });
        }
    } else {
        res.render('recruiter_post_a_job', {
            view: 'post-a-job',
            data: userData
        });
    }
});

router.get('/assessments', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    let redirectFrom = req.query.f;
    let response = req.query.r;

    if (typeof redirectFrom != 'undefined' && redirectFrom) {
        if (redirectFrom == 'c_a') {
            res.render('recruiter_assessments', {
                view: 'assessments',
                data: userData,
                showAlert: true,
                alertMessage: response == 's' ? 'Assessment Created Successfully' : 'An error occured. Please try again',
                alertType: response == 's' ? 'success' : 'error'
            });
        }
    } else {
        res.render('recruiter_assessments', {
            view: 'assessments',
            data: userData
        });
    }
});

router.get('/create-assessment', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;

    res.render('recruiter_create_assessment', {
        view: 'assessments',
        data: userData
    });
});

router.get("/get-recruiter-activity-history", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getUserActivityHistory(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].date_time_ago = _helpers2.default.getCurrentTimeAgo(data[i].date_created);
            }
            res.status(200).json({
                message: "Activity History found.",
                activityHistory: data
            });
        }
    });
});

router.get("/get-recruiter-statistics", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.getCountOfJobOpenings(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let recruiterJobOpeningsCount = data[0].count;

            _database2.default.query(user.getCountOfTotalQualifiedCandidates(user_id), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                } else {
                    let recruiterTotalQualifiedCandidatesCount = data[0].count;

                    _database2.default.query(user.getCountOfRecruiterSavedCandidates(user_id), (err, data) => {
                        if (err) {
                            _log4js2.default.log(err);
                        } else {
                            let recruiterSavedCandidates = data[0].count;

                            let assessment = new _assessment2.default();
                            _database2.default.query(assessment.getCountOfRecruiterAssessmentsCreated(user_id), (err, data) => {
                                if (err) {
                                    _log4js2.default.log(err);
                                } else {
                                    let recruiterAssessmentCreated = data[0].count;

                                    res.status(200).json({
                                        message: "Recruiter Statistics.",
                                        jobOpeningsCount: recruiterJobOpeningsCount,
                                        totalQualifiedCandidatesCount: recruiterTotalQualifiedCandidatesCount,
                                        savedCandidatesCount: recruiterSavedCandidates,
                                        assessmentsCreatedCount: recruiterAssessmentCreated
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post("/add", (req, res, next) => {
    'use strict';

    //read user information from request

    let user = new _user2.default();

    let user_uuid = (0, _v2.default)();
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let photo_url = req.body.photo_url;
    let social_media_id = req.body.social_media_id;
    let password = req.body.password;

    let username = '';
    let other_name = '';
    let gender = '';
    let dob = '';
    let profile_completeness = '';
    let tagline = '';

    _database2.default.query(_user2.default.checkIfEmailExist(email), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                /* res.status(200).json({
                     message:"This email address exists in our database."
                 }); */

                res.redirect('/register?v=f');
            } else {
                let is_activated = _config2.default.not_activated;

                _database2.default.query(user.createUserQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated), (err, data) => {
                    if (!err) {
                        if (data) {
                            let user_id = data.insertId;

                            let company_name = req.body.company_name;
                            let industry = req.body.industry;
                            let rc_number = req.body.rc_number;
                            let no_of_employees = req.body.no_of_employees;
                            let year_established = req.body.year_established;
                            let type_of_employer = req.body.type_of_employer;
                            let facebook_link = req.body.facebook_link;
                            let twitter_link = req.body.twitter_link;
                            let instagram_link = req.body.instagram_link;
                            let google_plus_link = req.body.google_plus_link;
                            let linkedin_link = req.body.linkedin_link;
                            let youtube_channel_link = req.body.youtube_channel_link;
                            let company_phone_number = req.body.phone_number;
                            let company_email = req.body.company_email;
                            let website = req.body.website;
                            let country = req.body.country;
                            let address = req.body.address;
                            let state = req.body.state;
                            let company_logo = req.body.company_logo;
                            let company_banner_img_url = req.body.company_banner_img_url;

                            _database2.default.query(user.createCompanyQuery(company_name, industry, no_of_employees, year_established, type_of_employer, rc_number, facebook_link, instagram_link, twitter_link, google_plus_link, youtube_channel_link, linkedin_link, website, address, country, state, company_phone_number, company_email, company_logo, company_banner_img_url, user_id), (err, data) => {

                                let company_id = data.insertId;

                                if (!err) {

                                    _database2.default.query(_user2.default.addCompanyToRecruiter(user_id, company_id), (err, data) => {
                                        if (!err) {
                                            _database2.default.query(_user2.default.insertUserRole(user_id, _config2.default.recruiter_admin_role_tag), (err, data) => {
                                                if (!err) {
                                                    _helpers2.default.saveActivityTrail(user_id, "Register", "Registration Completed.");

                                                    // Redirect to login authentication to load session
                                                    let redirect_link = '/auth/login?username=' + email + '&password=' + password;
                                                    res.redirect(redirect_link);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

router.post("/add-teammates", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let newTeammatesemails = JSON.parse(req.body.emails);

    for (let i = 0; i < newTeammatesemails.length; i++) {
        addTeammate(req, res, newTeammatesemails[i]);
    }
});

function addTeammate(req, res, email) {

    let user_uuid = (0, _v2.default)();
    let first_name = '';
    let last_name = '';
    let phone_number = '';
    let photo_url = '';
    let social_media_id = '';
    let password = '';
    let username = '';
    let other_name = '';
    let gender = '';
    let dob = '';
    let profile_completeness = '';
    let tagline = '';

    _database2.default.query(_user2.default.checkIfEmailExist(email), (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                res.status(200).json({
                    result: false
                });
            } else {
                let is_activated = _config2.default.not_activated;

                let userData = req.session.passport.user;
                let recruiter_full_name = recruiterData.full_name;
                let recruiter_email = recruiterData.email;
                let company_id = recruiterData.company_id;
                let company_name = recruiterData.company_name;

                let user = new _user2.default();
                _database2.default.query(user.createTeammateQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated, company_id), (err, data) => {

                    if (!err) {
                        if (data) {
                            let user_id = data.insertId;

                            if (!err) {
                                _database2.default.query(_user2.default.insertUserRole(user_id, _config2.default.recruiter_role_tag), (err, data) => {
                                    if (!err) {
                                        _helpers2.default.saveActivityTrail(user_id, "Teammate Invited", "You were invited by " + recruiter_full_name + " (" + recruiter_email + ") to the team");

                                        //Send Invite Mail
                                        _mailer2.default.sendTeamInviteMail(req, email, recruiter_full_name, company_name, "Recruiter");

                                        res.status(200).json({
                                            result: true
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });
}

router.get("/create-password", (req, res, next) => {

    let user_id = req.query.userId;

    res.render('recruiter_create_password', { user_id: user_id });
});

router.get("/get-all-company-teammates", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let company_id = userData.company;

    _database2.default.query(_user2.default.getAllCompanyTeamMembersByCompanyId(company_id), (err, data) => {
        if (!err) {
            res.status(200).json({
                message: "All Team Members.",
                teammates: data
            });
        }
    });
});

router.post("/update", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    if (req.body.current_password) {
        changePassword(req, res, user_id, userData);
    } else if (req.body.company_name) {
        updateCompanyProfile(req, res, user_id, userData);
    } else {
        updatePersonalProfile(req, res, user_id, userData);
    }
});

router.post("/create-password-for-invited-user", (req, res, next) => {
    let user_id = req.body.user_id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let password = req.body.password;

    _database2.default.query(_user2.default.updateInvitedUserInfo(user_id, first_name, last_name, password), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Password Created", "Password has been created successfully.");

                res.redirect('/login?f=u_iu&r=s');
            } else {
                res.redirect('/recruiters/create-password?userId=' + user_id);
            }
        }
    });
});

function updatePersonalProfile(req, res, user_id, userData) {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;

    let user = new _user2.default();

    _database2.default.query(user.updateRecruiterQuery(user_id, first_name, last_name, email, phone_number), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Profile Updated", "You updated your profile.");

                //Saving back to session
                req.session.passport.user = {
                    user_id: userData.user_id,
                    user_uuid: userData.user_uuid,
                    first_name: first_name,
                    last_name: last_name,
                    username: userData.username,
                    other_name: userData.other_name,
                    email: email,
                    phone_number: phone_number,
                    address: userData.address,
                    state: userData.state,
                    country: userData.country,
                    gender: userData.gender,
                    dob: userData.dob,
                    profile_completeness: userData.profile_completeness,
                    photo_url: userData.photo_url,
                    social_media_id: userData.social_media_id,
                    company: userData.company,
                    tagline: userData.tagline,
                    password: userData.password,
                    last_login_time: userData.last_login_time,
                    last_login_ip_address: userData.last_login_ip_address,
                    date_created: userData.date_created,
                    is_activated: userData.is_activated,
                    is_password_set: userData.is_password_set,
                    activation_token: userData.activation_token,
                    invite_token: userData.invite_token,
                    is_invite_token_active: userData.is_invite_token_active,
                    is_first_login: userData.is_first_login,
                    role_id: userData.role_id,
                    company_id: userData.company_id,
                    company_name: userData.company_name
                };

                res.redirect('/recruiters/settings?r=s&f=u_p');
            } else {
                res.redirect('/recruiters/settings?r=f');
            }
        }
    });
}

function updateCompanyProfile(req, res, user_id, userData) {
    let company_id = userData.company_id;
    let company_name = req.body.company_name;
    let rc_number = req.body.rc_number;
    let industry = req.body.industry;
    let no_of_employees = req.body.no_of_employees;
    let year_established = req.body.year_established;
    let type_of_employer = req.body.type_of_employer;
    let facebook_link = req.body.facebook_link;
    let instagram_link = req.body.instagram_link;
    let twitter_link = req.body.twitter_link;
    let google_plus_link = req.body.google_plus_link;
    let linkedin_link = req.body.linkedin_link;
    let youtube_channel_link = req.body.youtube_channel_link;
    let company_phone_number = req.body.company_phone_number;
    let company_email = req.body.company_email;
    let company_website = req.body.company_website;
    let country = req.body.country;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let company_logo_url = req.body.company_logo_url;
    let company_banner_img_url = req.body.company_banner_img_url;
    let company_description = req.body.company_description;

    let user = new _user2.default();

    _database2.default.query(user.updateRecruiterCompany(company_id, company_name, rc_number, industry, no_of_employees, year_established, type_of_employer, facebook_link, instagram_link, twitter_link, google_plus_link, linkedin_link, youtube_channel_link, company_phone_number, company_email, company_website, country, address, city, state, company_logo_url, company_banner_img_url, company_description), (err, data) => {

        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(user_id, "Company Profile Updated", "Company Profile has been updated.");

                req.session.passport.user = {
                    user_id: userData.user_id,
                    user_uuid: userData.user_uuid,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    username: userData.username,
                    other_name: userData.other_name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    state: userData.state,
                    country: userData.country,
                    gender: userData.gender,
                    dob: userData.dob,
                    profile_completeness: userData.profile_completeness,
                    photo_url: userData.photo_url,
                    social_media_id: userData.social_media_id,
                    company: userData.company,
                    tagline: userData.tagline,
                    password: userData.password,
                    last_login_time: userData.last_login_time,
                    last_login_ip_address: userData.last_login_ip_address,
                    date_created: userData.date_created,
                    is_activated: userData.is_activated,
                    is_password_set: userData.is_password_set,
                    activation_token: userData.activation_token,
                    invite_token: userData.invite_token,
                    is_invite_token_active: userData.is_invite_token_active,
                    is_first_login: userData.is_first_login,
                    role_id: userData.role_id,
                    company_id: userData.company_id,
                    company_name: company_name
                };

                res.redirect('/recruiters/settings?r=s&f=u_cp');
            }
        }
    });
}

function changePassword(req, res, user_id, userData) {
    _log4js2.default.log("in update password ooo");
    let current_password = req.body.current_password;
    let new_password = req.body.new_password;

    _database2.default.query(_user2.default.getUserPasswordQuery(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else if (!data) {
            _log4js2.default.log("incorrect password");

            res.redirect('/recruiters/settings?f=p&r=i_p');
        } else {
            if (data.length > 0) {
                if (!_bcryptjs2.default.compareSync(current_password, data[0].password)) {
                    _log4js2.default.log("Password does not match");

                    res.redirect('/recruiters/settings?f=p&r=p_m');
                } else {
                    _log4js2.default.log("about to update");
                    _database2.default.query(_user2.default.updatePasswordQuery(user_id, new_password), (err, data) => {
                        if (!err) {
                            if (data && data.affectedRows > 0) {

                                _helpers2.default.saveActivityTrail(user_id, "Password", "Password has been changed successfully.");

                                res.redirect('/recruiters/settings?f=p&r=p_s');
                            } else {
                                res.redirect('/recruiters/settings?f=p&r=p_e');
                            }
                        }
                    });
                }
            }
        }
    });
}

router.post("/upload-profile-picture", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let userData = req.session.passport.user;
    let user_id = userData.user_id;

    let form = new _formidable2.default.IncomingForm();

    /* form.on('fileBegin', function (name, file){
        if(file.name != ''){
            // Check if dir exist. If not create
            helpers.checkIfDirectoryExist(config.profile_picture_upload_dir);
              let originalFileExtension = path.extname(file.name).toLowerCase();
              file.name = userData.user_id + '_' + userData.first_name + '_' + 
                        userData.last_name + '_profile_pic' + originalFileExtension;
              file.path = config.profile_picture_upload_dir + file.name;
        } 
    });  
      form.on('file', function (name, file){
        if(file.name != ''){     
            //Upload additional file       
            logger.log('Uploaded ' + file.name);
            helpers.copyFile(file.path, config.main_assets_profile_pic_dir);
        }
    }); */

    form.parse(req, function (err, fields, files) {
        if (err) {
            _log4js2.default.log(err);
        } else {

            let azureHelper = new _azure_helpers2.default();
            azureHelper.uploadProfilePictureToAzure(files);

            let profile_pic_url = '';
            let full_profile_pic_url = '';

            if (files.profile_picture.name != '') {
                profile_pic_url = files.profile_picture.name;
                full_profile_pic_url = _config2.default.azure_profile_pic_url + profile_pic_url;
            }

            let user = new _user2.default();
            _database2.default.query(user.updateProfilePictureUrlQuery(user_id, full_profile_pic_url), (err, data) => {
                if (err) {
                    _log4js2.default.log(err);
                    _helpers2.default.saveActivityTrail(user_id, "Profile Picture Upload", "Profile Picture upload failed");

                    res.status(200).json({
                        status: 'failed'
                    });
                } else {
                    _helpers2.default.saveActivityTrail(user_id, "Profile Picture Upload", "Profile Picture Uploaded");

                    //Saving back to session
                    req.session.passport.user = {
                        user_id: userData.user_id,
                        user_uuid: userData.user_uuid,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        username: userData.username,
                        other_name: userData.other_name,
                        email: userData.email,
                        phone_number: userData.phone_number,
                        address: userData.address,
                        state: userData.state,
                        country: userData.country,
                        gender: userData.gender,
                        dob: userData.dob,
                        profile_completeness: userData.profile_completeness,
                        photo_url: full_profile_pic_url,
                        social_media_id: userData.social_media_id,
                        company: userData.company,
                        tagline: userData.tagline,
                        password: userData.password,
                        last_login_time: userData.last_login_time,
                        last_login_ip_address: userData.last_login_ip_address,
                        date_created: userData.date_created,
                        is_activated: userData.is_activated,
                        is_password_set: userData.is_password_set,
                        activation_token: userData.activation_token,
                        invite_token: userData.invite_token,
                        is_invite_token_active: userData.is_invite_token_active,
                        is_first_login: userData.is_first_login,
                        role_id: userData.role_id,
                        company_id: userData.company_id,
                        company_name: userData.company_name
                    };

                    res.status(200).json({
                        status: 'success',
                        message: "Profile picture uploaded.",
                        photo_url: full_profile_pic_url
                    });
                }
            });
        }
    });

    form.on('error', function (name, file) {
        if (file.name != '') {
            _log4js2.default.log('Error Uploading file: ' + file.name);
        }
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        if (bytesReceived && bytesExpected) {
            let percent_complete = bytesReceived / bytesExpected * 100;
            _log4js2.default.log(percent_complete.toFixed(2));
        }
    });
});

router.post("/download-resume", (req, res, next) => {
    let user_id = req.body.candidate_id;

    let user = new _user2.default();
    _database2.default.query(user.getCandidateCV(user_id), (err, data) => {
        if (err) {
            _log4js2.default.log(err);
        } else {
            let candidate_resume_url = typeof data[0].resume_file_url != 'undefined' && data[0].resume_file_url && data[0].resume_file_url != '' && data[0].resume_file_url != null ? data[0].resume_file_url : 'false';

            if (candidate_resume_url != 'false') {
                _helpers2.default.downloadFile(res, candidate_resume_url);
            } else {
                res.status(200).json({
                    message: 'CV/Resume not Downloaded',
                    isDownloaded: false
                });
            }
        }
    });
});

router.post("/remove-saved-candidate", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let candidate_id = req.body.candidate_id;

    let userData = req.session.passport.user;
    let recruiter_user_id = userData.user_id;

    let user = new _user2.default();
    _database2.default.query(user.removeSavedCandidate(candidate_id, recruiter_user_id), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {

                _helpers2.default.saveActivityTrail(recruiter_user_id, "Candidate Removed", "You removed a candidate from your saved resumes");

                res.status(200).json({
                    message: 'Candidate Removed.',
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "Candidate Not found."
                });
            }
        }
    });
});

router.post("/delete", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    var userId = req.body.userId;

    _database2.default.query(_user2.default.deleteUserByIdQuery(userId), (err, data) => {
        if (!err) {
            if (data && data.affectedRows > 0) {
                res.status(200).json({
                    message: `User deleted with id = ${userId}.`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message: "User Not found."
                });
            }
        }
    });
});

router.post("/download-excel-file", (req, res, next) => {
    _helpers2.default.checkifAuthenticated(req, res);

    let job_id = req.body.job_id;
    let job_name = req.body.job_name;
    let excel_file_to_download = req.body.excel_file_to_download;

    if (excel_file_to_download == 'all') {
        _database2.default.query(_job2.default.getAllJobApplicantsForExcel(job_id), (err, data) => {
            if (!err) {
                let applicants_list = data;

                for (let i = 0; i < applicants_list.length; i++) {
                    applicants_list[i].date_applied = _helpers2.default.formatDateTime(applicants_list[i].date_applied);
                }

                _excel2.default.createAllApplicantsWorkbook(res, job_id, job_name, applicants_list);
            }
        });
    } else if (excel_file_to_download == 'shortlist') {
        _database2.default.query(_job2.default.getAllShortlistedJobApplicantsForExcel(job_id), (err, data) => {
            if (!err) {
                let applicants_list = data;

                for (let i = 0; i < applicants_list.length; i++) {
                    applicants_list[i].date_applied = _helpers2.default.formatDateTime(applicants_list[i].date_applied);
                }

                _excel2.default.createAllShortlistedApplicantsWorkbook(res, job_id, job_name, applicants_list);
            }
        });
    } else if (excel_file_to_download == 'non_shortlist') {
        _database2.default.query(_job2.default.getAllNonShortlistedJobApplicantsForExcel(job_id), (err, data) => {
            if (!err) {
                let applicants_list = data;

                for (let i = 0; i < applicants_list.length; i++) {
                    applicants_list[i].date_applied = _helpers2.default.formatDateTime(applicants_list[i].date_applied);
                }

                _excel2.default.createAllNonShortlistedApplicantsWorkbook(res, job_id, job_name, applicants_list);
            }
        });
    }
});

router.get('/job-detail/:jobId', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let jobId = req.params.jobId;
    let userData = req.session.passport.user;

    _database2.default.query(_job2.default.getJobByIdQuery(jobId), (err, data) => {
        if (!err) {
            let jobData = data[0];

            jobData.job_description = jobData.job_description.substring(0, jobData.job_description.length - 1);
            jobData.job_responsibilities = jobData.job_responsibilities.substring(0, jobData.job_responsibilities.length - 1);

            jobData.job_description = jobData.job_description + "<br><br><h6>Job Responsibilities</h6><br>" + jobData.job_responsibilities;

            jobData.job_description = _helpers2.default.unescapeHTML(jobData.job_description);

            res.render('recruiter_job_details', {
                view: 'created-jobs',
                data: userData,
                jobData: jobData
            });
        }
    });
});

router.get('/edit-job/:jobId', function (req, res) {
    _helpers2.default.checkifAuthenticated(req, res);

    let jobId = req.params.jobId;
    let userData = req.session.passport.user;

    _database2.default.query(_job2.default.getJobByIdQuery(jobId), (err, data) => {
        if (!err) {
            let jobData = data[0];

            _log4js2.default.log(jobData);

            res.render('recruiter_edit_job', {
                view: 'created-jobs',
                data: userData,
                jobData: jobData
            });
        }
    });
});

module.exports = router;