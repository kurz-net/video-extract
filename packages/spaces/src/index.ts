import dotenv from "dotenv";
import aws from "aws-sdk";

dotenv.config();

export default class Space {
  endpoint?: string;
  key?: string;
  secret?: string;
  s3: aws.S3;

  constructor() {
    this.endpoint = process.env.S3_ENDPOINT;
    this.key = process.env.S3_KEY;
    this.secret = process.env.S3_SECRET;
    if (!this.endpoint || !this.key || !this.secret) {
      throw new Error("Missing S3 env variables");
    }

    this.s3 = new aws.S3({
      endpoint: new aws.Endpoint(this.endpoint),
      accessKeyId: this.key,
      secretAccessKey: this.secret,
      httpOptions: {
        timeout: 0,
      },
    });
  }
}
