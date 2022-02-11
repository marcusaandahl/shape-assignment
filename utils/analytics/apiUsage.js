const fs = require('fs');

// Makes sure the daily quota is not exceeded
function useRequest() {
    var usage = JSON.parse(fs.readFileSync('db/usage.json'));
    if (usage.usage < usage.limit){
        usage.usage += 1;
        fs.writeFileSync('db/usage.json', JSON.stringify(usage, null, 4));
    } else {
        throw new Error('Usage limit reached');
    }
}


/**
 * This is the second part of the solution i had in mind.
 * After spending hours on it, i realised that it was too ambitious to do alone, in the time i had available.
 * Therefore, I have left the code after my attempt at it. And focused instead on hitting the specification requirements.
 * 
 * The idea of this second part, was to manage api usage in a smart way.
 * Optimally, using analytics to create an "activity map" with times where calls to the API is most popular.
 * This would be used in conjunction with a scaled down interval quota of, for example, 10 minutes.
 * 
 * In other words, the API call limit would be set per 10 minutes instead of per day. The amount of API calls available per 10 minutes,
 * would depend on the user activity at that time a day, and the distribution map would get smarter/adjust every day.
 * 
 * Furthermore, When making an API request, we would make the API request, and store the data. In such way, repeated requests with
 * similar locations would be unneccessary, and API calls would be saved for newer data.
 * 
 * I will gladly expand on it all, and I am deeply fustrated I couldn't see my idea through, but I hope we get to talk about it
 * either way.
 */


// //PATH TO DB
// const dailyBacklogPath = 'db/dailyBacklog.json';
// const intervalTrackerPath = 'db/intervalTracker.json';
// const distributionPath = 'db/distribution.json';

// // Backlog Instance Connector
// class Backlog {
//     // Adds new data to the daily Summary Backlog
//     addToSummaryBackLog(data) {
//         const newData = JSON.parse(fs.readFileSync(dailyBacklogPath).toString());
//         newData.summaryRequests.push(data);
//         fs.writeFileSync(dailyBacklogPath, JSON.stringify(newData, null, 4));
//     }
//     // Adds new data to the daily Locations Backlog
//     addToLocationsBackLog(data) {
//         const newData = JSON.parse(fs.readFileSync(dailyBacklogPath).toString());
//         newData.locationRequests.push(data);
//         fs.writeFileSync(dailyBacklogPath, JSON.stringify(newData, null, 4));
//     }
//     clearBacklog() {
//         fs.writeFileSync(dailyBacklogPath, JSON.stringify({
//             "summaryRequests": [],
//             "locationRequests": []
//         }, null, 4));
//     }
//     getAllSummaryData() {
//        return JSON.parse(fs.readFileSync(dailyBacklogPath).toString()).summaryRequests;
//     }
//     getSummaryDataByLocation(locs) {
//         var retData = [];
//         var locsArr = [];
//         Array.isArray(locs) ? locsArr = locs : locsArr = [locs];
//         this.getAllSummaryData().forEach(data => {
//             if (locsArr.includes(data.latlong)) {
//                 retData.push(data);
//             }
//         })
//         return retData;
//     }
//     getAllLocationsData() {
//         return JSON.parse(fs.readFileSync(dailyBacklogPath).toString()).locationRequests;
//     }
//     getLocationsDataByLocation(locs) {
//         var retData = [];
//         var locsArr = [];
//         Array.isArray(locs) ? locsArr = locs : locsArr = [locs] 
//         this.getAllLocationsData().forEach(data => {
//             if (locsArr.includes(data.latlong)) {
//                 retData.push(data);
//             }
//         })
//         return retData;
//     }
// }

// class IntervalTracker {
//     getIntervalTracker() {
//         return JSON.parse(fs.readFileSync(intervalTrackerPath).toString()).distribution;
//     }

//     getDistribution() {
//         return JSON.parse(fs.readFileSync(intervalTrackerPath).toString()).distribution;
//     }

//     getMaxRequests() {
//         return JSON.parse(fs.readFileSync(intervalTrackerPath).toString()).maxRequests;
//     }

//     getUsedRequests() {
//         return JSON.parse(fs.readFileSync(intervalTrackerPath).toString()).usedRequests;
//     }
    
//     getCurrentInterval() {
//         return JSON.parse(fs.readFileSync(intervalTrackerPath).toString()).currentInterval;
//     }

//     getRequestsRemaining() {
//         return (this.getMaxRequests() - this.getUsedRequests());
//     }

//     updateRequests(amount) {
//         var intervalTracker = this.getIntervalTracker();
//         var usedRequests = intervalTracker.usedRequests;
//         var maxRequests = intervalTracker.maxRequests;
//         amount ? usedRequests += amount : usedRequests +=1;
//         amount ? maxRequests -= amount : maxRequests -=1;
//         intervalTracker.usedRequests = usedRequests;
//         intervalTracker.maxRequests = maxRequests;
//         fs.writeFileSync(intervalTrackerPath, JSON.stringify(intervalTracker, null, 4));
//     }

//     updateInterval() {
//         const dist = new Distribution();
//         const interval = dist.getCurrentInterval();
//         var intervalTracker = this.getIntervalTracker();
//         intervalTracker.currentInterval = interval;
//         fs.writeFileSync(dailyBacklogPath, JSON.stringify(intervalTracker, null, 4));
//     }

//     resetIntervalTracker() {
//         const dist = new Distribution();
//         const interval = dist.getCurrentInterval();
//         fs.writeFileSync(dailyBacklogPath, JSON.stringify({
//             "distribution": 0.0,
//             "maxRequests": 0,
//             "usedRequests": 0,
//             "currentInterval": interval
//         }, null, 4));
//     }
// }

// function getIntervalNr(intervalSecs) {
//     var today = new Date(), today_abs = new Date(), today_secs = 0;
//     today_abs.setHours(0);
//     today_abs.setMinutes(0);
//     today_abs.setSeconds(0);
//     today_secs = (today.getTime() - today_abs.getTime()) / 1000;
//     return ((today_secs - today_secs % intervalSecs)/intervalSecs);
// }

// class Distribution {
//     getDistribution() {
//         return JSON.parse(fs.readFileSync(distributionPath));
//     }

//     getDistributionMap() {
//         return this.getDistribution().distMap;
//     }

//     fillRequests(requests) {
//         var dist = this.getDistribution();
//         const intervalNr = getIntervalNr(dist.interval);
//         const totalIntervals = (24*60*60)/(dist.interval);
//         const remainintIntervals = totalIntervals-intervalNr;
//         const requestsPerInterval = (requests/remainintIntervals);
//         var distMap = dist.distMap;
//         for (let i = intervalNr; i < remainintIntervals; i++) {
//             distMap[i].requests += requestsPerInterval;
//         }
//         dist.distMap = distMap;
//         fs.writeFileSync(distributionPath, JSON.stringify(dist, null, 4));
//     }

//     // createFreshDistributionMap() {
//     //     const distribution = this.getDistribution();
//     //     const dailyIntervals = (24*60*60)/distribution.interval;
//     //     const reqPerInterval = Math.floor(10000/dailyIntervals);
//     //     const dist = 1/dailyIntervals;
//     //     const jsObj = {
//     //         interval: 600,
//     //         distMap: []
//     //     };
//     //     for (let i = 0; i<dailyIntervals; i++) {
//     //         jsObj.distMap.push({
//     //             requests: reqPerInterval,
//     //             dist: dist
//     //         })
//     //     }
//     //     fs.writeFileSync(distributionPath, JSON.stringify(jsObj, null, 4));
//     // }

//     updateInterval(interval) {
//         var distObj = JSON.parse(fs.readFileSync(distributionPath));
//         distObj.interval = interval;
//         fs.writeFileSync(distributionPath, JSON.stringify(distObj, null, 4));
//         const intervalTracker = new IntervalTracker();
//         intervalTracker.updateInterval(interval)
//     }
// }

// function tickRequest(type, rawLocations) {
//     var returnData, reqNeeded;
//     var locationsMissing = [];
//     var locations = rawLocations.split(',').map(loc => {
//         return [`${loc[0]}${loc[1]}`, `${loc[2]}${loc[3]}`]
//     })
//     const backlogObj = new Backlog();
//     const intervalTrackerObj = new IntervalTracker();
//     switch (type) {
//         case 'summary':
//             returnData = backlogObj.getSummaryDataByLocation(locations);
//             reqNeeded = (locations.length - returnData.length)
//             break;
//         case 'location':
//             returnData = backlogObj.getLocationsDataByLocation(locations);
//             reqNeeded = (locations.length - returnData.length)
//             break;
//         default:
//             throw new Error('Request not detected');
//     }
//     console.log(reqNeeded, locations, intervalTrackerObj.getRequestsRemaining());
//     if (intervalTrackerObj.getRequestsRemaining() >= reqNeeded) {
//         locations
//         .forEach(location => {
//             var locFound = false;
//             returnData.forEach(data => {
//                 if (parseInt(data.latlong) == parseInt(location)) {
//                     locFound = true;
//                 }
//             })
//             if (locFound) {
//                 locationsMissing.push(parseInt(location))
//             }
//         })
//         const response = {
//             data: returnData,
//             locationsMissing: locationsMissing,
//         }

//         intervalTrackerObj.updateRequests(reqNeeded);

//         return response

//     } else {
//         throw new Error("Not enough requests available");
//     }
// }

// function summaryRequestMade(data) {
//     const backlogObj = new Backlog();
//     backlogObj.addToSummaryBackLog(data);
// }

// function locationsRequestMade(data) {
//     const backlogObj = new Backlog();
//     backlogObj.addToLocationsBackLog(data);
// }

// function tickInterval() {
//     const intervalTrackerObj = new IntervalTracker();
//     const distObj = new Distribution();
//     distObj.fillRequests(intervalTrackerObj.getRequestsRemaining());
    
//     intervalTrackerObj.resetIntervalTracker();
// }

// function tickDaily() {

//     // Create todays dist map
//     // Compare and adjust dist maps
//     // Clear backlog
// }

module.exports = {useRequest}