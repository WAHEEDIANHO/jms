const { JobModel, ApplicationModel } = require("../models")
const { APIError, STATUS_CODES} = require('../../utils/app-errors')


class JobRepository{
    // Create job
    async createJob (job) {
        try {
            const newJob = await JobModel.create(job);
            return newJob;
        } catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Job')
        }
    }

    async applyJob (applicationForm) {
        try {
            const application = await ApplicationModel.create(applicationForm);
            return application;
        }catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to apply for Job')
        }
    }

    async submitApplication ({jobId, applicationId}) {
        try {
            const job = await JobModel.findById(jobId);
            job.applications.push(applicationId);
            job.save();
            return job;
        }catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to sunmit application')
        }
    }

//    fetch all job
    async getJob (query) {
        console.log(query)
        try {
            let advQuery  = { start: 0, end: 0, limit: 0 };

            for( const key of Object.keys(query)) {
                if (key == ('limit' || 'start' || 'end')) {
                    advQuery[key] = query[key];
                    delete query[key];
                }
            }

            console.log("updated", query, advQuery)
            const jobs = await JobModel.find(query).limit(advQuery.limit).sort({'createdAt': -1});
            return jobs;
        } catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'No job find')
        }
    }

    async getOneJob (query) {
        console.log("getOneJob query ", query)
        try {
            const { userId, jobId } = query
            const job = await JobModel.findOne({ userId, _id: jobId });
            return job;
        } catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'No job find')
        }
    }

//    get job by Id
    async getJobById (id) {
        try {
            const job = await JobModel.findById(id);
            return job;
        } catch (e) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Job not find')
        }
    }

    //    update Job
    async updateJob (id, update) {
        try {
            const job = await JobModel.findByIdAndUpdate(id, update);
            return job;
        } catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Job update fail')
        }
    }

    //    Delete Job
    async deleteJob (id) {
        try {
            const job = await JobModel.findByIdAndDelete(id);
            return job;
        } catch (e) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Job update fail')
        }
    }

    // async countJob () {
    //     try {
    //         return await JobModel.count();
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

module.exports = JobRepository