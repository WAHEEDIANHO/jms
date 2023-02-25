const { JobRepository } = require("../database");
const { FormatData } = require("../utils");
const { BadRequestError } = require("../utils/app-errors")
const Console = require("console");

class JobService {
    constructor() {
        this.repository = new JobRepository();
    }

    //create job
    async createJob (jobData) {
        try {
            const job = await this.repository.createJob(jobData)
            return FormatData(job)
        }catch (e) {
            throw e;
        }
    }

    async applyJob (applicantForm, jobId) {
        try {
            const application = await this.repository.applyJob(applicantForm)
            const update = await this.repository.submitApplication({ applicationId: application._id, jobId });
            return FormatData(update)
        } catch (e) {
            throw e
        }
    }
   //receive job
   async getJob(query) {
       console.log(query)
       try {
           const jobs = await this.repository.getJob(query);
           return FormatData(jobs);
       } catch (e) {
           throw new BadRequestError(e.message, e)
       }
    }

    //retrieve job by Id
    async getJobById(id) {
        try {
            return await this.repository.getJobById(id);
        }catch (e) {
            throw e;
        }
    }

    //retrieve user job
    async getUserJob (userId) {
        try {
            const invoices = this.repository.getJob({user: userId});
            return FormatData(invoices);
        } catch (e) {
            throw new BadRequestError(e.message, e)
        }
    }


    async updateJob ({ userId, jobId, update }) {
        console.log("bravo updateJob called")
        try {
            const job = await this.repository.getOneJob({ userId: userId, jobId: jobId });
            if (!job) console.log(`userId: ${userId}`, `jobId: ${jobId}`)
            else {
                    const jobKey = Object.keys(job._doc);
                    jobKey.forEach(key => {
                        if(update.hasOwnProperty(key)) {
                            console.log('update has ', key)
                            job[key] = update[key]
                        }
                    })

                const jb = await this.repository.updateJob(job._id, job);
                console.log(jb)
                return FormatData(jb)
            }

        } catch (e) { throw e}
    }

    async deleteJob ({ userId, jobId}) {
        console.log("bravo1 updateJob called")
        try {
            const job = await this.repository.getOneJob({ userId: userId, jobId: jobId });
            if (!job) console.log(`userId: ${userId}`, `jobId: ${jobId}`)
            else {
                const jobDel = await this.repository.deleteJob(job._id)
                console.log(jobDel)
                return FormatData(jobDel)
                // const inv = await invoice.save()
            }
        } catch (e) { throw e}
    }
}

module.exports = JobService