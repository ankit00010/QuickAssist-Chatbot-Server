import { client } from "../../../config/database";
import { editFields } from "../../chatbot/models/faq_model";

class AdminRepository{

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
  id:string
  ): Promise<boolean> {
    const db = await client.db("master");
   
        const deleteData=await db.collection("faq_info").findOneAndDelete({
            faq_id:id
        });


        if (deleteData) {
            return true
        }
        return false;
  }




}


export default AdminRepository;