import { MongoClient } from "mongodb";


let client:MongoClient;



export async function initalizeMongo(){



    try {
        

        const mongoURL=process.env.URL || "";

        client= new MongoClient(mongoURL);
        await client.connect();
        console.log("Connected to Mongodb Database");
        


    } catch (error) {
        console.error("Error connecting a Database:",error)
        throw error;
    }



}

export {client};