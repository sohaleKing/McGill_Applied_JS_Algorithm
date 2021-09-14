'use strict';
var utils = require('utils');
var aws = require('aws-sdk');
var _ = require('lodash');
var Json2csvParser = require('json2csv').Parser;
var moment = require('moment-timezone');

module.exports = {
    execute: function (event, context, callback) {
        var ressourcePath = event.context["resource-path"];
        if (ressourcePath)
        {
            var filters = getFilters(event);
            /*      var identityId = event.context["cognito-identity-id"];
                  var isCapangoSupportQuery = "SELECT Count(u.id) as isCapangoSupportUser "+
                  " FROM user u WHERE u.identityid = ? "+
                  " AND u.companyId = '11c4cc9d-4b1e-4666-bb8d-816e736da4a2'";

                  var isCapangoSupportParams = [identityId];
                  utils.query(event, isCapangoSupportQuery, isCapangoSupportParams, (err, isCapangoSupportResult) => {
                    if (err || !_.head(isCapangoSupportResult).isCapangoSupportUser)
                    {
                      callback(utils.errorCtr(403, new Error("Capango Support privileges required for this action"), null, event, context));
                    }
                    else
                    {        */
            var newYorkTime = moment.tz("America/New_York");
            var newYorkOffset = (-1 * newYorkTime.utcOffset()); //Here we apply the reserve of the offset so we get the value saved in UTC form local time.  ex.  local 00:00:00 with -4 offset is saved by MySQL at 04:00:00
            var today = new Date();
            today.setMinutes(today.getMinutes() - newYorkOffset);

            var year = today.getFullYear();
            var month = today.getMonth();
            var day = today.getDate();

            //if a filter was applied on the year
            if (filters.year)
            {
                year = filters.year;
            }

            //if a filter was applied on the month
            if (!isNaN(parseInt(filters.month)))
            {
                month = filters.month;
            }

            //if a filter was applied on the day
            if (filters.day)
            {
                day = filters.day;
            }
            var date = new Date(year, month, day, 0, newYorkOffset, 0, 0);

            switch (ressourcePath.toUpperCase()) {
                case "/REPORT/SUMMARY":
                    getSummary(event, context, callback, date);
                    break;

                case "/REPORT/EMPLOYERS":
                    getEmployerHistory(event, context, callback, date);
                    break;

                case "/REPORT/EMPLOYERS/{EMPLOYERID}":
                    getEmployerActivity(event, context, callback, date);
                    break;

                case "/REPORT/EMPLOYERS/{EMPLOYERID}/BILLINGSUMMARY":
                    getEmployerBillingSummary(event, context, callback, date);
                    break;

                case "/REPORT/JOBS":
                    getJobsReport(event, context, callback, date);
                    break;

                case "/REPORT/SEEKERS":
                    getSeekersReport(event, context, callback, date);
                    break;

                case "/REPORT/REVENUE":
                    getRevenueByMonth(event, context, callback, date);
                    break;

                default:
                    callback(utils.errorCtr(500, new Error("Invalid query resource path " + ressourcePath.toUpperCase()), null, event, context));
                    break;
            }
            /*        }
                  });*/
        }
        else
        {
            callback(utils.errorCtr(500, new Error("Invalid query"), null, event, context));
        }
    }
}

function getFilters (event)
{
    var yearFilter = null;
    //if a filter was applied on the year
    if (event.params.querystring.year)
    {
        yearFilter = event.params.querystring.year;
    }

    var monthFilter = null;
    //if a filter was applied on the month
    if (event.params.querystring.month)
    {
        monthFilter = event.params.querystring.month;
        /* months are 0 based in the Date object so remove 1 to param passed. */
        monthFilter -= 1;
    }

    var dayFilter = null;
    //if a filter was applied on the day
    if (event.params.querystring.day)
    {
        dayFilter = event.params.querystring.day;
    }

    return {
        year : yearFilter,
        month : monthFilter,
        day : dayFilter
    }
}

function getSummary(event, context, callback, date) {
    var sql =
        "SELECT " +
        "'Employers Registered', " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY))) Today, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (? - INTERVAL 1 DAY) AND ?)) Yesterday, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN subdate(?,WEEKDAY(?)) AND (subdate(?,WEEKDAY(?)) + INTERVAL 7 DAY))) ThisWeek, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (subdate(?,WEEKDAY(?)) - INTERVAL 7 DAY) AND subdate(?,WEEKDAY(?)))) LastWeek, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN subdate(?,DAYOFMONTH(?)) AND (subdate(?,DAYOFMONTH(?)) + INTERVAL 1 MONTH))) ThisMonth, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (subdate(?,DAYOFMONTH(?)) - INTERVAL 1 MONTH) AND subdate(?,DAYOFMONTH(?)))) LastMonth, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN subdate(?,DAYOFYEAR(?)) AND (subdate(?,DAYOFYEAR(?)) + INTERVAL 1 YEAR))) YearToDate, " +
        "(SELECT COUNT(id) FROM company WHERE id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (DATE_FORMAT(NOW() ,'%Y-01-01 00:00:01') - INTERVAL 1 YEAR) AND (DATE_FORMAT(NOW() ,'%Y-12-31 23:59:59') - INTERVAL 1 YEAR))) LastYear " +
        "UNION " +
        "SELECT " +
        "'Recruiters Registered', " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY))) Today, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN (? - INTERVAL 1 DAY) AND ?)) Yesterday, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN subdate(?,WEEKDAY(?)) AND (subdate(?,WEEKDAY(?)) + INTERVAL 7 DAY))) ThisWeek, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN (subdate(?,WEEKDAY(?)) - INTERVAL 7 DAY) AND subdate(?,WEEKDAY(?)))) LastWeek, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN subdate(?,DAYOFMONTH(?)) AND (subdate(?,DAYOFMONTH(?)) + INTERVAL 1 MONTH))) ThisMonth, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN (subdate(?,DAYOFMONTH(?)) - INTERVAL 1 MONTH) AND subdate(?,DAYOFMONTH(?)))) LastMonth, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN subdate(?,DAYOFYEAR(?)) AND (subdate(?,DAYOFYEAR(?)) + INTERVAL 1 YEAR))) YearToDate, " +
        "(SELECT COUNT(id) FROM user WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND roles LIKE '%employer%' AND (createDate BETWEEN (DATE_FORMAT(NOW() ,'%Y-01-01 00:00:01') - INTERVAL 1 YEAR) AND (DATE_FORMAT(NOW() ,'%Y-12-31 23:59:59') - INTERVAL 1 YEAR))) LastYear " +
        "UNION " +
        "SELECT " +
        "'Postings', " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY))) Today, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (? - INTERVAL 1 DAY) AND ?)) Yesterday, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN subdate(?,WEEKDAY(?)) AND (subdate(?,WEEKDAY(?)) + INTERVAL 7 DAY))) ThisWeek, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (subdate(?,WEEKDAY(?)) - INTERVAL 7 DAY) AND subdate(?,WEEKDAY(?)))) LastWeek, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN subdate(?,DAYOFMONTH(?)) AND (subdate(?,DAYOFMONTH(?)) + INTERVAL 1 MONTH))) ThisMonth, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (subdate(?,DAYOFMONTH(?)) - INTERVAL 1 MONTH) AND subdate(?,DAYOFMONTH(?)))) LastMonth, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN subdate(?,DAYOFYEAR(?)) AND (subdate(?,DAYOFYEAR(?)) + INTERVAL 1 YEAR))) YearToDate, " +
        "(SELECT COUNT(id) FROM job WHERE companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted = 0 AND (createDate BETWEEN (DATE_FORMAT(NOW() ,'%Y-01-01 00:00:01') - INTERVAL 1 YEAR) AND (DATE_FORMAT(NOW() ,'%Y-12-31 23:59:59') - INTERVAL 1 YEAR))) LastYear " +
        "UNION " +
        "SELECT " +
        "'Seekers Registered', " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY))) Today, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN (? - INTERVAL 1 DAY) AND ?)) Yesterday, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN subdate(?,WEEKDAY(?)) AND (subdate(?,WEEKDAY(?)) + INTERVAL 7 DAY))) ThisWeek, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN (subdate(?,WEEKDAY(?)) - INTERVAL 7 DAY) AND subdate(?,WEEKDAY(?)))) LastWeek, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN subdate(?,DAYOFMONTH(?)) AND (subdate(?,DAYOFMONTH(?)) + INTERVAL 1 MONTH))) ThisMonth, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN (subdate(?,DAYOFMONTH(?)) - INTERVAL 1 MONTH) AND subdate(?,DAYOFMONTH(?)))) LastMonth, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN subdate(?,DAYOFYEAR(?)) AND (subdate(?,DAYOFYEAR(?)) + INTERVAL 1 YEAR))) YearToDate, " +
        "(SELECT COUNT(id) FROM user WHERE isDeleted = 0 AND roles LIKE '%seeker%' AND isDeleted=0 AND (createDate BETWEEN (DATE_FORMAT(NOW() ,'%Y-01-01 00:00:01') - INTERVAL 1 YEAR) AND (DATE_FORMAT(NOW() ,'%Y-12-31 23:59:59') - INTERVAL 1 YEAR))) LastYear ";

    var params = [];
    var i;
    for (i = 0; i < 96; i++) {
        params.push(date);
    }

    utils.query(event, sql, params, (err, info) => {
        if (err) {
            callback(err);
        } else {
            formatReportData(info, event, callback);
        }
    }, true);
}

function getEmployerHistory(event, context, callback, date) {
    var startDateFromFilter = event.params.querystring.startDateFrom;
    var startDateToFilter = event.params.querystring.startDateTo;
    var filterDateStatement = "";
    var params = [];

    var i;
    for (i = 0; i < 4; i++) {
        params.push(date);
    }

    if (Date.parse(startDateToFilter) && Date.parse(startDateFromFilter)) {
        filterDateStatement += " AND createDate >= ? AND createDate <= ? ";
        var j;
        for (j = 0; j < 3; j++) {
            params.push(startDateFromFilter);
            params.push(startDateToFilter);
        }
    }

    var sql =
        "SELECT " +
        "  c.id CompanyId, c.name CompanyName, " +
        "    (SELECT COUNT(id) FROM user WHERE companyId = c.id AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY)) AND isDeleted = 0) NewUsersToday, " +
        "    (SELECT COUNT(id) FROM job WHERE companyId = c.id AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY)) AND isDeleted = 0) NewJobsToday, " +
        "    (SELECT COUNT(id) FROM user WHERE companyId = c.id AND isDeleted = 0  "+ filterDateStatement +" ) UsersTotal, " +
        "    (SELECT COUNT(id) FROM job WHERE companyId = c.id AND isDeleted = 0 "+ filterDateStatement +" ) OpenJobs, " +
        "    (SELECT COUNT(id) FROM job WHERE companyId = c.id "+ filterDateStatement +" ) JobsTotal " +
        "FROM " +
        "  company c " +
        "WHERE " +
        "  c.id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND c.isDeleted = 0 " +
        "GROUP BY " +
        "  c.id " +
        "ORDER BY " +
        "  c.name";


    utils.query(event, sql, params, (err, info) => {
        if (err) {
            callback(err);
        } else {
            formatReportData(info, event, callback);
        }
    }, true);
}

function getJobsReport(event, context, callback, date) {
    var info = {};
    var filter = event.params.querystring.searchBy;
    var startDateFromFilter = event.params.querystring.startDateFrom;
    var startDateToFilter = event.params.querystring.startDateTo;
    var filterDateStatement = "";
    var params = [date, date];

    if (Date.parse(startDateToFilter) && Date.parse(startDateFromFilter)) {
        filterDateStatement += " AND createDate >= ? AND createDate <= ? ";
        params.push(startDateFromFilter);
        params.push(startDateToFilter);
    }

    var sql;

    if (filter == "state") {
        sql =
            "SELECT distinctState.stateProvinceCode as State, COALESCE(NewJobsToday.cnt,0) as NewJobsToday, COALESCE(JobsTotal.cnt,0) as JobsTotal " +
            "FROM " +
            "(SELECT DISTINCT(IFNULL(stateProvinceCode, '_NULL_')) as stateProvinceCode " +
            "FROM job " +
            "WHERE isDeleted = 0 ) distinctState " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(stateProvinceCode, '_NULL_') as stateProvinceCode FROM job WHERE isDeleted = 0 AND companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted=0 AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY)) GROUP BY stateProvinceCode) NewJobsToday " +
            "ON NewJobsToday.stateProvinceCode = distinctState.stateProvinceCode " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(stateProvinceCode, '_NULL_') as stateProvinceCode FROM job WHERE isDeleted = 0 AND companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted=0 "+ filterDateStatement +" GROUP BY stateProvinceCode ) JobsTotal " +
            "ON JobsTotal.stateProvinceCode = distinctState.stateProvinceCode " +
            "GROUP BY distinctState.stateProvinceCode " +
            "ORDER BY distinctState.stateProvinceCode";

    } else if (filter=="zip") {
        sql =
            "SELECT distinctPostalCodes.postalCode as ZipCode, distinctPostalCodes.stateProvinceCode as stateCode,  COALESCE(NewJobsToday.cnt,0) as NewJobsToday, COALESCE(JobsTotal.cnt,0) as JobsTotal " +
            "FROM " +
            "(SELECT DISTINCT(IFNULL(postalCode, '_NULL_')) as postalCode, stateProvinceCode " +
            "FROM job " +
            "WHERE isDeleted = 0 ) distinctPostalCodes " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(postalCode, '_NULL_') as postalCode FROM job WHERE isDeleted = 0 AND companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted=0 AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY)) GROUP BY postalCode) NewJobsToday " +
            "ON NewJobsToday.postalCode = distinctPostalCodes.postalCode " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(postalCode, '_NULL_') as postalCode FROM job WHERE isDeleted = 0 AND companyId <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND isDeleted=0 "+ filterDateStatement +" GROUP BY postalCode ) JobsTotal " +
            "ON JobsTotal.postalCode = distinctPostalCodes.postalCode " +
            "GROUP BY distinctPostalCodes.postalCode " +
            "ORDER BY distinctPostalCodes.postalCode";
    }

    if(sql) {
        utils.query(event, sql, params, (err, info) => {
            if (err) {
                callback(err);
            } else {
                formatReportData(info, event, callback);
            }
        }, true);
    } else {
        callback(utils.errorCtr(500, new Error("Failed to get jobs report"), null));
    }
}

function getSeekersReport(event, context, callback, date) {
    var info = {};
    var filter = event.params.querystring.searchBy;
    var startDateFromFilter = event.params.querystring.startDateFrom;
    var startDateToFilter = event.params.querystring.startDateTo;
    var filterDateStatement = "";
    var params = [date, date];

    if (Date.parse(startDateToFilter) && Date.parse(startDateFromFilter)) {
        filterDateStatement += " AND createDate >= ? AND createDate <= ? ";
        params.push(startDateFromFilter);
        params.push(startDateToFilter);
    }

    var sql;

    if (filter == "state") {
        sql =
            "SELECT distinctState.stateProvinceCode as State, COALESCE(NewSeekersToday.cnt,0) as NewSeekersToday, COALESCE(SeekersTotal.cnt,0) as SeekersTotal " +
            "FROM " +
            "(SELECT DISTINCT(IFNULL(u.stateProvinceCode, '_NULL_')) as stateProvinceCode " +
            "FROM user u) distinctState " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(stateProvinceCode, '_NULL_') as stateProvinceCode FROM user WHERE isDeleted = 0 AND roles = '[seeker]' AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY)) GROUP BY stateProvinceCode) NewSeekersToday " +
            "ON NewSeekersToday.stateProvinceCode = distinctState.stateProvinceCode " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(stateProvinceCode, '_NULL_') as stateProvinceCode FROM user WHERE isDeleted = 0 AND roles = '[seeker]'  "+ filterDateStatement +" GROUP BY stateProvinceCode ) SeekersTotal " +
            "ON SeekersTotal.stateProvinceCode = distinctState.stateProvinceCode " +
            "GROUP BY distinctState.stateProvinceCode " +
            "ORDER BY distinctState.stateProvinceCode";

    } else if (filter=="zip") {
        sql =
            "SELECT distinctPostalCodes.postalCode as ZipCode, distinctPostalCodes.stateProvinceCode as StateCode, COALESCE(NewSeekersToday.cnt,0) as NewSeekersToday, COALESCE(SeekersTotal.cnt,0) as SeekersTotal " +
            "FROM " +
            "(SELECT DISTINCT(IFNULL(u.postalCode, '_NULL_')) as postalCode, stateProvinceCode " +
            "FROM user u) distinctPostalCodes " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(postalCode, '_NULL_') as postalCode FROM user WHERE isDeleted = 0 AND roles = '[seeker]' AND (createDate BETWEEN ? AND (? + INTERVAL 1 DAY)) GROUP BY postalCode) NewSeekersToday " +
            "ON NewSeekersToday.postalCode = distinctPostalCodes.postalCode " +
            "LEFT JOIN " +
            "(SELECT COUNT(id) as cnt, IFNULL(postalCode, '_NULL_') as postalCode FROM user WHERE isDeleted = 0 AND roles = '[seeker]'  "+ filterDateStatement +" GROUP BY postalCode ) SeekersTotal " +
            "ON SeekersTotal.postalCode = distinctPostalCodes.postalCode " +
            "GROUP BY distinctPostalCodes.postalCode " +
            "ORDER BY distinctPostalCodes.postalCode";
    }

    if(sql) {
        utils.query(event, sql, params, (err, info) => {
            if (err) {
                callback(err);
            } else {
                formatReportData(info, event, callback);
            }
        }, true);
    } else {
        callback(utils.errorCtr(500, new Error("Failed to get seekers report"), null));
    }

}

function getEmployerActivity(event, context, callback, date) {
    var today = new Date();
    var newYorkTime = moment.tz(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), "America/New_York");
    var interval = Math.abs(newYorkTime.utcOffset());
    var companyId = event.params.path.employerId;
    //Temp Hack waiting for DrillDownSpecs to specify a route for this in the API
    var disableCompanyFilter = companyId === "all";
    let downLoadStatus = event.params.querystring.downLoadStatus;

    //If year is specified, apply it, if not ignore.
    var year = event.params.querystring.year;
    if (isNaN(year)) {
        year = newYorkTime.format("YYYY");
    }
    var sql;
    if (downLoadStatus == 1) {


        //Seconnd Part starts
        let params = [];
        let startDateFromFilter = event.params.querystring.startDateFrom;
        let startDateToFilter = event.params.querystring.startDateTo;
        let filterDateStatementPosting = "";
        let filterDateStatementInvite = "";
        let filterDateStatementInterest = "";
        let filterDateStatementNoInterest = "";
        let filterDateStatementMatched = "";
        let filterDateStatementContact = "";
        let filterDateStatementSelect = "";
        let filterDateStatementHidden = "";
        let filterDateStatementUnread = "";
        let filterDateStatementLogin = "";

        let companyFilter = disableCompanyFilter ? " " : "         AND c.id = ? ";
        if (Date.parse(startDateToFilter) && Date.parse(startDateFromFilter)) {
            filterDateStatementPosting += " AND j.createDate >= ? AND j.createDate <= ? ";
            filterDateStatementInvite += " AND a.createDate >= ? AND a.createDate <= ? ";
            filterDateStatementInterest += " AND a.createDate >= ? AND a.createDate <= ? ";
            filterDateStatementNoInterest += " AND uj.createDate >= ? AND uj.createDate <= ? ";
            filterDateStatementMatched += " AND uj.createDate >= ? AND uj.createDate <= ? ";
            filterDateStatementContact += " AND uj.createDate >= ? AND uj.createDate <= ? ";
            filterDateStatementSelect += " AND uj.createDate >= ? AND uj.createDate <= ? ";
            filterDateStatementHidden += " AND uj.createDate >= ? AND uj.createDate <= ? ";
            filterDateStatementUnread += " AND uj.createDate >= ? AND uj.createDate <= ? ";
            filterDateStatementLogin += " AND l.dateTime >= ? AND l.dateTime <= ? ";
            for (let i = 0; i < 10; i++) {
                params.push(startDateFromFilter);
                params.push(startDateToFilter);
            }
        }

        if (!disableCompanyFilter) {
            params.push(companyId);
        }
        sql =
            "SELECT" +
            "    c.id CompanyId, c.name CompanyName, " +
            "      ( SELECT COUNT(j.id) " +
            "         FROM job j " +
            "         WHERE j.publishDate is not NULL AND j.companyId = c.id" + filterDateStatementPosting + ") posting, " +
            "      ( SELECT COUNT(a.id) " +
            "         FROM action a " +
            "         JOIN job j ON j.id = a.jobId " +
            "         WHERE a.isDeleted = 0 AND j.companyId = c.id AND a.actionTypeCode = 'employerInterest'" + filterDateStatementInvite + " ) invite, " +
            "	    ( SELECT COUNT(a.id) " +
            "  	      FROM action a " +
            "         JOIN job j ON j.id = a.jobId " +
            "         WHERE a.isDeleted = 0 AND j.companyId = c.id AND a.actionTypeCode = 'seekerInterest'" + filterDateStatementInterest + " ) interest, " +
            "	    ( SELECT COUNT(uj.Id) " +
            "  	      FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 AND j.companyId = c.id " +
            "         AND uj.interestDate is not NULL AND interestStatus = 'NoInterest'" + filterDateStatementNoInterest + " ) noInterest, " +
            "	    ( SELECT COUNT(uj.Id) " +
            "  	      FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0  AND j.companyId = c.id " +
            "         AND uj.matchDate is not NULL" + filterDateStatementMatched + "  ) matched, " +
            "     ( SELECT COUNT(uj.Id) " +
            "  	      FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 AND j.companyId = c.id " +
            "         AND uj.contactDate is not NULL" + filterDateStatementContact + " ) contact, " +
            "	    ( SELECT COUNT(uj.Id) " +
            "  	      FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 AND j.companyId = c.id " +
            "         AND uj.selectDate is not NULL" + filterDateStatementSelect + " ) selected, " +
            "	    ( SELECT COUNT(uj.Id) " +
            "		      FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.hideDate is not NULL" + filterDateStatementHidden + " ) hidden, " +
            "	    ( SELECT COUNT(uj.Id) " +
            "  	      FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.readDate is NULL and uj.updateBy = uj.userId" + filterDateStatementUnread + " ) unreadByEmployer, " +
            "	    ( SELECT COUNT(l.Id) " +
            "  	      FROM log l " +
            "         JOIN user u ON u.email = l.message COLLATE utf8_unicode_ci" +
            "         WHERE l.code = 'LOGIN' AND u.isDeleted = 0 AND u.companyId = c.id " + filterDateStatementLogin + ") login " +
            "  FROM " +
            "    company c " +
            "  WHERE " +
            "    c.id <> '02946e13-dc37-4ae4-b6be-95b8d7482b9e' AND c.isDeleted = 0 " + companyFilter +
            "  GROUP BY " +
            "    c.id " +
            "  ORDER BY " +
            "    c.name;  ";

        utils.query(event, sql, params, (err, info) => {
            if (err) {
                callback(err);
            } else {
                //Remove the CompanyId columns form the Report if thius query is for All companies.
                var hideColumns = null;
                var footerRowParams = null;
                hideColumns = ['CompanyId'];
                formatReportData(info, event, callback, footerRowParams, hideColumns);
            }
        }, true);

    } else {
        var companyFilter = disableCompanyFilter ? " " : "         AND j.companyId = ? ";
        let companyIdFilter = disableCompanyFilter ? " " : "         AND u.companyId = ? ";
        sql =
            "SELECT statusCountPerMonth.status, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 1 THEN statusCountPerMonth.cnt ELSE 0 END) AS january, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 2 THEN statusCountPerMonth.cnt ELSE 0 END) AS febuary, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 3 THEN statusCountPerMonth.cnt ELSE 0 END) AS march, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 4 THEN statusCountPerMonth.cnt ELSE 0 END) AS april, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 5 THEN statusCountPerMonth.cnt ELSE 0 END) AS may, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 6 THEN statusCountPerMonth.cnt ELSE 0 END) AS june, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 7 THEN statusCountPerMonth.cnt ELSE 0 END) AS july, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 8 THEN statusCountPerMonth.cnt ELSE 0 END) AS august, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 9 THEN statusCountPerMonth.cnt ELSE 0 END) AS september, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 10 THEN statusCountPerMonth.cnt ELSE 0 END) AS october, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 11 THEN statusCountPerMonth.cnt ELSE 0 END) AS november, " +
            "   MAX(CASE WHEN statusCountPerMonth.monthNumber = 12 THEN statusCountPerMonth.cnt ELSE 0 END) AS december, " +
            "   SUM(statusCountPerMonth.cnt) as total " +
            "FROM( " +
            "   SELECT COUNT(j.id) as cnt, MONTH(DATE_SUB(j.publishDate, INTERVAL ? MINUTE)) monthNumber, 'posting' as status, 1 as displayOrder " +
            "       FROM job j " +
            "       WHERE j.publishDate is not NULL " +
            companyFilter +
            "       AND YEAR(DATE_SUB(j.publishDate, INTERVAL ? MINUTE)) = ? " +
            "       GROUP BY MONTH(DATE_SUB(j.publishDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(a.id) as cnt, MONTH(DATE_SUB(a.createDate, INTERVAL ? MINUTE)) monthNumber, 'invite' as status, 2 as displayOrder " +
            "     FROM action a " +
            "         JOIN job j ON j.id = a.jobId " +
            "         WHERE a.isDeleted = 0 AND a.actionTypeCode = 'employerInterest' " +
            companyFilter +
            "         AND YEAR(DATE_SUB(a.createDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(a.createDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(a.id) as cnt, MONTH(DATE_SUB(a.createDate, INTERVAL ? MINUTE)) monthNumber, 'interest' as status, 3 as displayOrder " +
            "	  FROM action a " +
            "         JOIN job j ON j.id = a.jobId " +
            "         WHERE a.isDeleted = 0 AND a.actionTypeCode = 'seekerInterest' " +
            companyFilter +
            "         AND YEAR(DATE_SUB(a.createDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(a.createDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(uj.Id) as cnt, MONTH(DATE_SUB(uj.interestDate, INTERVAL ? MINUTE)) monthNumber, 'noInterest' as status, 4 as displayOrder " +
            "	  FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.interestDate is not NULL AND interestStatus = 'NoInterest' " +
            companyFilter +
            "         AND YEAR(DATE_SUB(uj.interestDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(uj.interestDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(uj.Id) as cnt, MONTH(DATE_SUB(uj.matchDate, INTERVAL ? MINUTE)) monthNumber, 'match' as status, 5 as displayOrder " +
            "	  FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.matchDate is not NULL " +
            companyFilter +
            "         AND YEAR(DATE_SUB(uj.matchDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(uj.matchDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(uj.Id) as cnt, MONTH(DATE_SUB(uj.contactDate, INTERVAL ? MINUTE)) monthNumber, 'contact' as status, 6 as displayOrder " +
            "	  FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.contactDate is not NULL " +
            companyFilter +
            "         AND YEAR(DATE_SUB(uj.contactDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(uj.contactDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(uj.Id) as cnt, MONTH(DATE_SUB(uj.selectDate, INTERVAL ? MINUTE)) monthNumber, 'select' as status, 7 as displayOrder " +
            "	  FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.selectDate is not NULL " +
            companyFilter +
            "         AND YEAR(DATE_SUB(uj.selectDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(uj.selectDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(uj.Id) as cnt, MONTH(DATE_SUB(uj.hideDate, INTERVAL ? MINUTE)) monthNumber, 'hide' as status, 8 as displayOrder " +
            "	  FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.hideDate is not NULL " +
            companyFilter +
            "         AND YEAR(DATE_SUB(uj.hideDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(uj.hideDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(uj.Id) as cnt, MONTH(DATE_SUB(uj.updateDate, INTERVAL ? MINUTE)) monthNumber, 'unreadByEmployer' as status, 9 as displayOrder " +
            "	  FROM userJob uj " +
            "         JOIN job j ON j.id = uj.jobId " +
            "         JOIN user u ON u.id = uj.userId " +
            "         WHERE u.isDeleted = 0 AND uj.isDeleted = 0 " +
            "         AND uj.readDate is NULL and uj.updateBy = uj.userId " +  //The last update was done by the seeker, but the employer did not see it.
            companyFilter +
            "         AND YEAR(DATE_SUB(uj.updateDate, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(uj.updateDate, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT COUNT(l.Id) as cnt, MONTH(DATE_SUB(l.datetime, INTERVAL ? MINUTE)) monthNumber, 'login' as status, 10 as displayOrder " +
            "	  FROM log l " +
            "         JOIN user u ON u.email = l.message COLLATE utf8_unicode_ci" +
            "         WHERE l.code = 'LOGIN' " +
            companyIdFilter +
            "         AND YEAR(DATE_SUB(l.datetime, INTERVAL ? MINUTE)) = ? " +
            "         GROUP BY MONTH(DATE_SUB(l.datetime, INTERVAL ? MINUTE)) " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'posting' as status, 1 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'invite' as status, 2 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'interest' as status, 3 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'noInterest' as status, 4 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'match' as status, 5 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'contact' as status, 6 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'select' as status, 7 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'hide' as status, 8 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'unreadByEmployer' as status, 9 as displayOrder " +
            "   UNION " +
            "   SELECT 0 as cnt, 1, 'login' as status, 10 as displayOrder " +
            "         )  statusCountPerMonth " +
            "GROUP BY statusCountPerMonth.status " +
            "ORDER BY statusCountPerMonth.displayOrder";
        var params = [];
        if (disableCompanyFilter) {
            var params = [interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval,
                interval, interval, year, interval
            ];
        } else {
            var params = [interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval,
                interval, companyId, interval, year, interval
            ];
        }
        utils.query(event, sql, params, (err, info) => {
            if (err) {
                callback(err);
            } else {
                formatReportData(info, event, callback);
            }
        }, true);
    }
}

function getEmployerBillingSummary(event, context, callback, date) {
    var filter = getEmployerBillingSummaryFilters(event, context, callback);
    var params = filter.params;
    var statement = "SELECT j.id, c.name as companyName, j.title, j.city, j.title, j.addressLine1, j.addressLine2, j.stateProvinceCode, " +
        "COALESCE(ujSelect.cnt, 0) as numberOfPositionsFilled, j.numberOfPositions," +
        "COALESCE(aInvite.cnt, 0) as inviteCount, CAST(COALESCE(aInvite.amount, 0) as DECIMAL(10,2)) as inviteAmount, COALESCE(aInterest.cnt, 0) as interestCount, CAST(COALESCE(aInterest.amount, 0) as DECIMAL(10,2)) as interestAmount, COALESCE(aUnlock.cnt, 0) as unlockCount, CAST(COALESCE(aUnlock.amount, 0) as DECIMAL(10,2)) as unlockAmount, " +
        "CAST((COALESCE(aInterest.amount, 0)+COALESCE(aInvite.amount, 0)+COALESCE(aUnlock.amount, 0)) as DECIMAL(10,2)) as total, " +
        "(CASE WHEN (ujSelect.cnt >0) THEN CAST((COALESCE(aInterest.amount, 0)+COALESCE(aInvite.amount, 0)+COALESCE(aUnlock.amount, 0)) / COALESCE(ujSelect.cnt, 0) as DECIMAL(10,2)) ELSE CAST(0 as DECIMAL(10,2)) END) as costPerHire, " +
        "(CASE WHEN (j.isDeleted = 1) THEN 'Archived' ELSE CASE WHEN (j.endDate is NULL || j.endDate >= CURRENT_TIMESTAMP()) THEN 'Open' ELSE 'Closed' END END) as status " +
        "FROM job j " +
        "JOIN company c ON j.companyId = c.id AND c.isDeleted = 0 " +
        "LEFT JOIN stateProvince p ON j.stateProvinceCode = p.code " +
        "LEFT JOIN (Select Count(a.id) as cnt, SUM(a.amount) as amount, a.jobId, j.companyId FROM action a JOIN job j ON j.id = a.jobId WHERE a.isDeleted = 0 AND a.actionTypeCode = 'seekerInterest' " + filter.actionStatement +
        filter.countGroupActionsByStatement + ") aInterest ON aInterest." + filter.countGroupActionsByMap +
        "LEFT JOIN (Select Count(a.id) as cnt, SUM(a.amount) as amount, a.jobId, j.companyId FROM action a JOIN job j ON j.id = a.jobId WHERE a.isDeleted = 0 AND a.actionTypeCode = 'employerInterest' " + filter.actionStatement +
        filter.countGroupActionsByStatement + ") aInvite ON aInvite." + filter.countGroupActionsByMap +
        "LEFT JOIN (Select Count(a.id) as cnt, SUM(a.amount) as amount, a.jobId, j.companyId  FROM action a JOIN job j ON j.id = a.jobId WHERE a.isDeleted = 0 AND a.actionTypeCode = 'employerUnlock' " + filter.actionStatement +
        filter.countGroupActionsByStatement + ") aUnlock ON aUnlock." + filter.countGroupActionsByMap +
        "LEFT JOIN (Select Count(uj.Id) as cnt, uj.jobId as jobId, j.companyId FROM userJob uj JOIN user u ON u.id = uj.userId JOIN job j ON j.id = uj.jobId WHERE u.isDeleted = 0 AND uj.selectDate IS NOT NULL " + filter.selectStatement + " AND uj.isDeleted = 0 " +
        filter.countGroupUserJobsByStatement + ") ujSelect ON ujSelect." + filter.countGroupUserJobsByMap;
    statement += filter.statement;
    statement += filter.groupByStatement;
    var orderby = getEmployerBillingSummarySorts(event);

    utils.query(event, statement + orderby, params, (err, info) => {
        if (err)
        {
            callback(err);
        }
        else
        {
            var footerRowParams = null;
            //Add a footer row with the totals if the call is exported in CSV
            if (info && event.params.querystring.saveAsCsvFile)
            {
                footerRowParams = [{
                    total:_.sumBy(info, function(o) { return parseFloat(o.total); })
                }];
            }

            //Remove the status columns form the Report if thius query is for All companies.
            var hideColumns = null;
            if (filter.isForAllCompanies)
            {
                hideColumns = ['status'];
            }

            formatReportData(info, event, callback, footerRowParams, hideColumns);
        }
    }, true);
}

function getEmployerBillingSummaryFilters(event) {
    var companyIdPath = event.params.path.employerId;
    var companyIdFilter = event.params.querystring.companyId;
    var filterParams = [];
    var filterStatement = " ";
    var filterActionStatement = " ";
    var filterSelectStatement = " ";
    var searchFilter = event.params.querystring.search;
    var actionDateFromFilter = event.params.querystring.actionDateFrom;
    var actionDateToFilter = event.params.querystring.actionDateTo;
    var isClosedFilter = getBoolean(event.params.querystring.isClosed);
    var isOpenFilter = getBoolean(event.params.querystring.isOpen);
    var isArchivedFilter = getBoolean(event.params.querystring.isArchived);
    var isHideActionsAtZeroFilter = getBoolean(event.params.querystring.isHideActionsAtZero);
    var groupByCompany = getBoolean(event.params.querystring.groupByCompany);
    var disableCompanyFilter = (!companyIdFilter || companyIdFilter==='all') && (!companyIdPath || companyIdPath==='all');

    //This filter will be applied on the dates of the ACTIONS
    if (Date.parse(actionDateFromFilter) && Date.parse(actionDateToFilter)) {
        filterActionStatement += " AND a.createDate >= ? AND a.createDate <= ? ";
        filterSelectStatement += " AND uj.selectDate >= ? AND uj.selectDate <= ? ";
        var dateFrom = new Date(actionDateFromFilter);
        var dateFromParam = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
        var dateTo = new Date(actionDateToFilter);
        var dateToParam = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
        filterParams.push(dateFromParam);
        filterParams.push(dateToParam);
        filterParams.push(dateFromParam);
        filterParams.push(dateToParam);
        filterParams.push(dateFromParam);
        filterParams.push(dateToParam);
        filterParams.push(dateFromParam);
        filterParams.push(dateToParam);
    } else {
        if (Date.parse(actionDateFromFilter)) {
            filterActionStatement += " AND a.createDate >= ? ";
            filterSelectStatement += " AND uj.selectDate >= ? ";
            var dateFrom = new Date(actionDateFromFilter);
            var dateFromParam = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
            filterParams.push(dateFromParam);
            filterParams.push(dateFromParam);
            filterParams.push(dateFromParam);
            filterParams.push(dateFromParam);
        }
        if (Date.parse(actionDateToFilter)) {
            filterActionStatement += " AND a.createDate <= ? ";
            filterSelectStatement += " AND uj.selectDate <= ? ";
            var dateTo = new Date(actionDateToFilter);
            var dateToParam = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
            filterParams.push(dateToParam);
            filterParams.push(dateToParam);
            filterParams.push(dateToParam);
            filterParams.push(dateToParam);
        }
    }

    if (disableCompanyFilter)
    {
        filterStatement = " WHERE j.companyId IS NOT NULL ";
    }
    else
    {
        //We give priority Company filter; then the company Path event
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(companyIdFilter))
        {
            filterParams.push(companyIdPath);
        }
        else
        {
            filterParams.push(companyIdFilter);
        }
        filterStatement = " WHERE j.companyId = ? ";
    }

    //Filter totals at 0 in range specified
    if (isHideActionsAtZeroFilter) {
        filterStatement += " AND (COALESCE(aInterest.cnt, 0)+COALESCE(aInvite.cnt, 0)+COALESCE(aUnlock.cnt, 0)+COALESCE(ujSelect.cnt, 0)) > 0 ";
    }

    //Closed
    var now = new Date().toISOString();
    if (isClosedFilter) {
        filterStatement += " AND j.endDate < ? AND j.isDeleted = 0 ";
        filterParams.push(now);
    }

    //Open
    if (isOpenFilter) {
        filterStatement += " AND (j.endDate IS NULL OR j.endDate >= ?) AND j.isDeleted = 0 ";
        filterParams.push(now);
    }

    //Archived
    if (isArchivedFilter) {
        filterStatement += " AND j.isDeleted = 1 ";
    }

    //Search
    if (searchFilter) {
        if(disableCompanyFilter)
        {
            filterStatement += " AND ( " +
                " c.name LIKE ? collate utf8_general_ci" +
                " ) ";
            filterParams.push('%' + searchFilter + '%');
        }
        else
        {
            filterStatement += " AND ( " +
                " j.title LIKE ? collate utf8_general_ci OR " +
                " j.city LIKE ? collate utf8_general_ci OR " +
                " j.postalCode LIKE ? collate utf8_general_ci " +
                " ) ";
            filterParams.push('%' + searchFilter + '%');
            filterParams.push('%' + searchFilter + '%');
            filterParams.push('%' + searchFilter + '%');
        }
    }

    //Sub Count group by
    var subCountActionsGroupBy = " group by a.jobId ";
    var subCountActionsGroupByMap = "jobId = j.id ";
    var subCountUserJobsGroupBy = " group by uj.jobId ";
    var subCountUserJobsGroupByMap = "jobId = j.id ";
    if(disableCompanyFilter)
    {
        subCountActionsGroupBy = " group by j.companyId ";
        subCountActionsGroupByMap = "companyId = j.companyId ";
        subCountUserJobsGroupBy = " group by j.companyId ";
        subCountUserJobsGroupByMap = "companyId = j.companyId ";
    }

    //GroupBy statement
    var groupBy = " GROUP BY j.id ";
    if (groupByCompany)
    {
        groupBy = " GROUP BY c.id ";
    }

    return {
        params: filterParams,
        statement: filterStatement,
        actionStatement: filterActionStatement,
        selectStatement: filterSelectStatement,
        countGroupActionsByStatement : subCountActionsGroupBy,
        countGroupActionsByMap : subCountActionsGroupByMap,
        countGroupUserJobsByStatement : subCountUserJobsGroupBy,
        countGroupUserJobsByMap : subCountUserJobsGroupByMap,
        groupByStatement: groupBy,
        isForAllCompanies: disableCompanyFilter
    };
}

//TODO: Move me to utils!
function getBoolean(value) {
    switch (value) {
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default:
            return false;
    }
}

function getEmployerBillingSummarySorts(event) {
    var sortStatement = "ORDER BY";
    var fieldMaps = [{
        queryParam: "TITLE",
        fieldName: "j.title"
    },
        {
            queryParam: "COMPANYNAME",
            fieldName: "c.name"
        },
        {
            queryParam: "INTERESTED",
            fieldName: "interestCount"
        },
        {
            queryParam: "INVITED",
            fieldName: "inviteCount"
        },
        {
            queryParam: "UNLOCKED",
            fieldName: "unlockCount"
        },
        {
            queryParam: "SELECTED",
            fieldName: "numberOfPositionsFilled"
        },
        {
            queryParam: "TOTAL",
            fieldName: "total"
        },
        {
            queryParam: "COSTPERHIRE",
            fieldName: "costPerHire"
        },
        {
            queryParam: "STATUS",
            fieldName: "status"
        },
        {
            queryParam: "LOCATION",
            fieldName: "j.city"
        },
    ]; //I use this to avoid injection string sent directly in an SQL query!

    //TODO: Move me to a common class!
    var sortQueryParams = event.params.querystring.orderBy;

    if (sortQueryParams) {
        var sortParams = sortQueryParams.split(',');

        _.forEach(sortParams, function (sortParam) {
            sortParam += "";
            var strippedSortParam = sortParam.replace(/[^a-zA-Z ]/g, "") + "";
            var field = _.find(fieldMaps, function (fm) {
                return strippedSortParam.toUpperCase().includes(fm.queryParam);
            });
            if (field) {
                var isDescending = sortParam.includes('-') || strippedSortParam.includes('DESC');
                sortStatement += " " + field.fieldName;
                sortStatement += isDescending ? " DESC," : ",";
            }
        });
    }
    return sortStatement == "ORDER BY" ? " ORDER BY j.updateDate DESC " : sortStatement.substr(0, sortStatement.length) + "  j.updateDate DESC ";
}

function getRevenueByMonth(event, context, callback, date) {

    var sql =
        "SELECT c.id, c.name, c.status, (COALESCE(transactionCount.balance, 0) - COALESCE(actionCount.balance, 0)) as billingBalance, COALESCE(monthTransactionCount.balance, 0) as monthBillingBalance, COALESCE(monthActionCount.balance, 0) as actionBalance, ((COALESCE(transactionCount.balance, 0) - COALESCE(actionCount.balance, 0) + COALESCE(monthTransactionCount.balance,0)) - COALESCE(monthActionCount.balance,0)) as endBalance " +
        "FROM company c " +
        "LEFT JOIN " +
        "(SELECT ba.companyId as companyId, COALESCE(SUM(amount),0) as balance FROM transaction t " +
        "       JOIN billingAccount ba on ba.id = t.billingAccountId " +
        "       WHERE t.status = 'success' AND t.type != 'trial' AND ba.cardBrand != 'TRIAL' " +
        "       AND (t.createDate < ?) " +
        "       GROUP BY (ba.companyId)) as transactionCount on transactionCount.companyId = c.id " +
        "LEFT JOIN " +
        "(SELECT j.companyId as companyId, COALESCE(SUM(amount),0) as balance FROM action a " +
        "       JOIN job j on a.jobId = j.id " +
        "       WHERE (a.createDate < ? AND a.createDate >= (SELECT MIN(createDate) from billingAccount ba WHERE ba.cardBrand != 'TRIAL' AND ba.companyId = j.companyId) AND a.isDeleted = 0)" +
        "       GROUP BY (j.companyId)) as actionCount on actionCount.companyId = c.id " +
        "LEFT JOIN " +
        "(SELECT ba.companyId as companyId, COALESCE(SUM(amount),0) as balance FROM transaction t " +
        "       JOIN billingAccount ba on ba.id = t.billingAccountId " +
        "       WHERE t.status = 'success' AND t.type != 'trial' AND ba.cardBrand != 'TRIAL' " +
        "       AND (t.createDate BETWEEN ? AND (? + INTERVAL 1 MONTH)) " +
        "       GROUP BY (ba.companyId)) as monthTransactionCount on monthTransactionCount.companyId = c.id " +
        "LEFT JOIN " +
        "(SELECT j.companyId as companyId, COALESCE(SUM(amount),0) as balance FROM action a " +
        "       JOIN job j on a.jobId = j.id " +
        "       WHERE(a.createDate BETWEEN ? AND (? + INTERVAL 1 MONTH) AND a.createDate >= (SELECT MIN(createDate) from billingAccount ba WHERE ba.cardBrand != 'TRIAL' AND ba.companyId = j.companyId) AND a.isDeleted = 0) " +
        "       GROUP BY (j.companyId)) as monthActionCount on monthActionCount.companyId = c.id "+
        "WHERE c.status NOT IN ('trial', 'inactive') AND c.isDeleted = 0 " +
        "ORDER BY c.name";
    var params = [date, date, date, date, date, date];
    utils.query(event, sql, params, (err, info) => {
        if (err) {
            callback(err);
        } else {

            var footerRowParams = null;
            //Add a footer row with the totals if the call is exported in CSV
            if (info && event.params.querystring.saveAsCsvFile)
            {
                footerRowParams = [{
                    billingBalance:_.sumBy(info, function(o) { return parseFloat(o.billingBalance); }),
                    monthBillingBalance:_.sumBy(info, function(o) { return parseFloat(o.monthBillingBalance); }),
                    actionBalance:_.sumBy(info, function(o) { return parseFloat(o.actionBalance); }),
                    endBalance:_.sumBy(info, function(o) { return parseFloat(o.endBalance); })
                }];
            }

            formatReportData(info, event, callback, footerRowParams);
        }
    }, true);
}

function formatReportData(data, event, callback, footerRowValues=null, hideColumns=null) {
    if (data && event.params.querystring.saveAsCsvFile) {
        var fileName = event.context["resource-path"];
        fileName += '_' + new Date().toISOString() + '.csv';
        fileName = fileName.replace("/", "");
        var companyId = event.params.path.employerId;
        if (companyId) {
            fileName = fileName.replace("{employerId}", companyId + "/");
        } else {
            fileName = fileName.replace("/", "_");
        }

        //Get the field list if specified, if not, return them all.
        var firstRow = _.head(data);
        if (firstRow)
        {
            var fields = Object.keys(firstRow);

            //We might want to hide some columns in the report
            if (hideColumns)
            {
                _.remove(fields, field => {
                    return _.indexOf(hideColumns, field) > -1;
                });
            }

            //Add a row totals as a footer
            if (footerRowValues)
            {
                var lastRow = _.clone(firstRow);
                Object.keys(lastRow).forEach(function (key)
                {
                    if (_.findIndex(footerRowValues, key) > -1 )
                    {
                        lastRow[key] = _.find(footerRowValues, key)[key];
                    }
                    else
                    {
                        lastRow[key] = null;
                    }
                });
                data.push(lastRow);
            }

            //Create csv file
            var json2csvParser = new Json2csvParser({
                fields
            });
            var csv = json2csvParser.parse(data);

            //Store the file in a bucket
            utils.getOrganisationConfig(event, (err, organisationConfig) => {
                if (err)
                {
                    callback(utils.errorCtr(500, new Error("Failed to load organisation config."), err));
                }
                else
                {
                    var s3 = new aws.S3();
                    var bucket = bucket = organisationConfig.s3public;
                    var putParams = {
                        Bucket: bucket,
                        Key: "reports/" + fileName,
                        Body: csv
                    };
                    s3.putObject(putParams, function (err, copyData) {
                        if (err)
                        {
                            callback(utils.errorCtr(500, new Error("Failed to report file."), err, event, context));
                        }
                        else
                        {
                            if (event.params.querystring.data)
                            {
                                //Return the datacollection with the with the URL Path.
                                callback(null, { data, reportUrl: 'https://s3.amazonaws.com/' + bucket + "/reports/" + fileName});
                            }
                            else
                            {
                                callback(null, { reportUrl: 'https://s3.amazonaws.com/' + bucket + "/reports/" + fileName});
                            }
                        }
                    });
                }
            });
        }
        else
        {
            //no rows to return
            callback(null, data);
        }
    }
    else
    {
        callback(null, data);
    }
}
