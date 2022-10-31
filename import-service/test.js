const csv = require('csv-parser');
const { S3 } = require('@aws-sdk/client-s3')
const s3 = new S3({});
// console.log(event.Records[0]);
// console.log(event.Records[0].s3);

const csvParseStream = async () => {

  const csvStream = await s3.getObject({
    Bucket: 'awshopuploads',
    Key: 'uploaded/test11',
  });
  new Promise((resolve, reject) => {
    // const chunks = [];
    csvStream.Body.pipe(csv())
      .on('data', (chunk) => console.log(chunk))
      .on('error', reject);
    // stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
  await s3.copyObject({
    Bucket: 'awshopuploads',
    CopySource: `${'awshopuploads'}/${'uploaded/test11'}`,
    Key: 'uploaded/test11'.replace('uploaded/', 'parsed/'),
  });

  await s3.deleteObject({
    Bucket: 'awshopuploads',
    Key: 'uploaded/test11',
  });
}

csvParseStream();