import { client } from "../../../config/database";
import ThrowError from "../../../middleware/error";
import { editFields } from "../models/faq_model";
import { UserDetails } from "../models/user_model";

class AdminRepository {

    //Find Data in a Database by Id


    static async findDataById(
        id: string
    ): Promise<boolean> {
        const db = await client.db("master");




        const find_data = await db.collection<any>("faq_info").findOne({
            faq_id: id,

        });


        if (!find_data) {
            return false
        }
        return true

    }

    static async dashboardDetailsRepo(

    ): Promise<{
        totalFAQs: number,
        toatlUsers: number,
        totalUnAnsweredQuestions: number,
        finalResult: { label: string, count: number }[],
    }> {


        const db = await client.db("master");

        //TOATAL USERS 
        const toatlUsers = await db.collection("user_data").countDocuments();
        //TOTAL FAQS
        const totalFAQs = await db.collection("faq_info").countDocuments();
        //TOTAL QUESTIONS
        const totalUnAnsweredQuestions = await db.collection("faq_questions").countDocuments();

        //FAQ DATA BASED ON THE CATEGORIES
        const getContextLists = await db.collection("faq_categories").aggregate([
            {
                $group: {
                    _id: null,
                    context_lists: { $addToSet: "$context" } // Collecting unique context values
                }
            },
            {
                $project: {
                    _id: 0, // Removing _id
                    context_lists: 1
                }
            }
        ]).toArray() as { context_lists: string[] }[];


        const contextListArray = getContextLists.length > 0 ? getContextLists[0].context_lists : []
        console.log("Context lists are ", contextListArray);




        const counterLists = await db.collection("faq_info").aggregate<{ _id: string; count: number }>([
            {
                $group: {
                    _id: "$context",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();


        const contextWithCounters: { _id: string; count: number }[] = counterLists.length > 0 ? counterLists : []
        // console.log("Context with counter lists => ", contextWithCounters);


        const counterMap = new Map(contextWithCounters.map(item => [item._id, item.count]));

        const finalResult = contextListArray.map(label => ({
            label,
            count: counterMap.get(label) || 0
        }));


        console.log("GRAPH DATA =>", finalResult);


        return {

            totalFAQs,
            toatlUsers,
            totalUnAnsweredQuestions,
            finalResult,

        }




    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Update Data function





    static async updateData(
        id: string,
        field: editFields
    ): Promise<boolean> {

        const db = await client.db("master");

        const updateData = await db.collection<any>("faq_info").findOneAndUpdate(
            { faq_id: id }, // Find the document by faq_id
            { $set: field }, // Use $set to update the provided fields in "field"
            { returnDocument: 'after' }
        );

        return updateData.value !== null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    static async deleteFaqData(
        id: string
    ): Promise<boolean> {
        const db = await client.db("master");

        const deleteData = await db.collection("faq_info").findOneAndDelete({
            faq_id: id
        });


        if (deleteData) {
            return true
        }
        return false;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    static async getFaqsData(
        page: number, limit: number, category: string
    ): Promise<any> {
        const db = await client.db("master");
        let filter: { context?: string } = {};

        if (category && category.trim() !== "") {
            filter.context = category;

        }
        console.log("Filter is ", filter);
        const totalUnAnsweredQuestions = await db.collection("faq_questions").countDocuments();
        const getFaqsData = await db.collection("faq_info").find(filter).skip((page - 1) * limit).limit(limit).project({ faq_id: 1, question: 1, answer: 1, context: 1, keywords: 1 }).toArray();
        const totalItems = await db.collection("faq_info").countDocuments(filter);
        console.log("The data founded is", getFaqsData.length)

        console.log("VALUE=> ", totalUnAnsweredQuestions);



        const totalPages = Math.ceil(totalItems / limit);
        const data = {
            page,
            totalPages,
            getFaqsData,
            totalItems,
            totalUnAnsweredQuestions
        }
        return data;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    static async getUsersCount(
    ): Promise<any> {

        const db = await client.db("master");




        const count = await db.collection("user_data").countDocuments();



        console.log("The result is ", count);


        // const getData = await db.collection<UserProps>("user_data").find({}).toArray();

        // console.log("USER DATA => ", getData);


        // if (getData === null) {
        //     throw new ThrowError(500, "NO USER", "NO USER IN A DATABASE");
        // }



        return count


        // const data
        // return getData;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    static async getUserDetails(
        BATCH_SIZE: number,
        BATCH_NO: number
    ): Promise<UserDetails[]> {
        const db = await client.db("master");

        const user_data: UserDetails[] = await db.collection<UserDetails>("user_data")
            .find({})
            .skip(BATCH_NO * BATCH_SIZE)
            .limit(BATCH_SIZE)
            .project<UserDetails>({ _id: 0, phone_number: 1, user_id: 1 })
            .toArray();

        return user_data;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    static async getUnAnsweredData(
        limit: number, user_Id: string
    ): Promise<{ questions_list: any[]; count: number | 0 }> {
        const db = await client.db("master");
        const questions_list = await db.collection("faq_questions")
            .find({ answers: { $exists: false }, lockedBy: { $in: [user_Id, null] } })
            .sort({ created_at: 1 })
            .limit(limit).toArray();
        let count = 0;
        const assignedDataCount = await db.collection("faq_questions").find({ lockedBy: user_Id }).toArray();

        if (questions_list.length === 0) {
            throw new ThrowError(500, "NO DATA FOUND", "No data is there");
        }


        if (assignedDataCount.length !== 0) {
            count = assignedDataCount.length;
        } else {
            count = questions_list.length;
        }


        const questionIds = questions_list.map(q => q._id);

        const lockingQuestions = await db.collection("faq_questions").updateMany(
            { _id: { $in: questionIds } },
            { $set: { lockedBy: user_Id, lockedAt: new Date() } }
        )

        if (!lockingQuestions.acknowledged) {
            throw new ThrowError(500, "Failed To Lock", `Something went wrong while locking questions for user ${user_Id}.`)
        }

        return { questions_list, count };
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    static async deleteUnAnsweredQuestions(
        user_ID: string
    ): Promise<boolean> {
        const db = await client.db("master");


        const count = await db.collection("faq_questions").find({ lockedBy: user_ID }).toArray();

        if (count.length === 0) {
            throw new ThrowError(500, "FAILURE", "No data available for deletion as no questions are assigned to you.");

        }

        const deleteData = await db.collection("faq_questions").deleteMany({ lockedBy: user_ID });


        if (!deleteData.acknowledged) {
            return false
        }
        return true
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async usersData(
        limit: number, skip: number
    ): Promise<any> {



        const db = await client.db("master");


        const getUsersData = await db.collection("user_data").find({}).skip(skip).limit(limit).toArray();


        console.log(getUsersData);




        const getTotalCount = await db.collection("user_data")
            .countDocuments({
                user_id: { $exists: true },
                phone_number: { $exists: true },
                name: { $exists: true }
            });

        let totalPages = 0
        console.log("The total Count is => ", getTotalCount);

        if (getTotalCount > 0) {
            totalPages = Math.ceil(getTotalCount / limit)

        } else {
            totalPages = 1;
        }

        if (!getUsersData || getUsersData.length === 0) {
            throw new ThrowError(500, "NO DATA FOUND", "No Users Data Available");
        }


        return {
            usersData: getUsersData,
            totalPages,
            totalItems: getTotalCount

        }




    }



}


export default AdminRepository;