const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const sns = new SNSClient({ });
const s3 = new S3Client({ });

module.exports.notify = async (event) => {
  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    const objectSize = record.s3.object.size;

    const presignedUrl = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    }),
    { expiresIn: 60 * 60});

    await sns.send(new PublishCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: "New APK Build Available",
        Message: `A new APK build is ready.\n\nFile Name: ${objectKey}\nFile Size: ${(objectSize / 1024 / 1024).toFixed(2)} MB\n\nDownload link (valid for 1 days):\n${presignedUrl}`,
    }));

    console.log(`Notified: ${objectKey} uploaded to ${bucketName}`);
  }
};