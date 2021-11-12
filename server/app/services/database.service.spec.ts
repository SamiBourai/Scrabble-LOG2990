import { injectable } from "inversify";
import { Course } from "../classes/course";
import { MongoClient, MongoClientOptions, Db } from "mongodb";
import "reflect-metadata";

// CHANGE the URL for your database information
const DATABASE_URL =
  "mongodb+srv://Admin:admin12345@cluster0.hcrok.mongodb.net/<dbname>?retryWrites=true&w=majority";
const DATABASE_NAME = "database";
const DATABASE_COLLECTION = "courses";

@injectable()
export class DatabaseService {
  private db: Db;
  private client: MongoClient;

  private options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
    try {
      let client = await MongoClient.connect(url, this.options);
      this.client = client;
      this.db = client.db(DATABASE_NAME);
    } catch {
      throw new Error("Database connection error")
    }

    if (
      (await this.db.collection(DATABASE_COLLECTION).countDocuments()) === 0
    ) {
      await this.populateDB();
    }
    return this.client;
  }

  async closeConnection(): Promise<void> {
    return this.client.close();
  }

  async populateDB(): Promise<void> {
    let courses: Course[] = [
      {
        name: "Object Oriented Programming",
        credits: 3,
        subjectCode: "INF1010",
        teacher: "Samuel Kadoury",
      },
      {
        name: "Intro to Software Engineering",
        credits: 3,
        subjectCode: "LOG1000",
        teacher: "Bram Adams",
      },
      {
        name: "Project I",
        credits: 4,
        subjectCode: "INF1900",
        teacher: "Jerome Collin",
      },
      {
        name: "Project II",
        credits: 3,
        subjectCode: "LOG2990",
        teacher: "Levis Theriault",
      },
      {
        name: "Web Semantics and Ontology",
        credits: 2,
        subjectCode: "INF8410",
        teacher: "Michel Gagnon",
      },
    ];

    console.log("THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE");
    for (const course of courses) {
      await this.db.collection(DATABASE_COLLECTION).insertOne(course);
    }
  }

  get database(): Db {
    return this.db;
  }
}
