import { client } from "../../../config/database";
import ThrowError from "../../../middleware/error";
import { editFields } from "../../chatbot/models/faq_model";
import { UserDetails, UserProps } from "../models/user_model";

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

        const getFaqsData = await db.collection("faq_info").find(filter).skip((page - 1) * limit).limit(limit).project({ faq_id: 1, question: 1, answer: 1, context: 1, keywords: 1 }).toArray();
        const totalItems = await db.collection("faq_info").countDocuments(filter);
        console.log("The data founded is", getFaqsData.length)



        const totalPages = Math.ceil(totalItems / limit);
        const data = {
            page,
            totalPages,
            getFaqsData,
            totalItems
        }
        return data;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    static async getUsersCount(
        message: string,
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



}


export default AdminRepository;