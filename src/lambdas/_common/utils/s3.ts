const AWS = require('aws-sdk');

let s3Options: any = { region: process.env.region };
if (process.env.IS_OFFLINE) {
	console.log('LOCAL ENVIRONMENT');
	s3Options = {
		s3ForcePathStyle: true,
		accessKeyId: 'S3RVER', // This specific key is required when working offline
		secretAccessKey: 'S3RVER',
		endpoint: new AWS.Endpoint('http://localhost:4569'),
	};
}
else {
	console.log('WE ARE IN AWS', process.env.region);
}

// @ts-ignore
const BUCKET_NAME = process.env.S3_BUCKET;
const S3 = new AWS.S3(s3Options);

console.log('Bucket name', process.env.S3_BUCKET);

const s3Helper = {
	setContent( path: string, content: string ) {
		const payload = {
			Bucket: BUCKET_NAME,
			Key: path,
			ContentType: 'text/plain',
			Body: content
		};

		return S3.putObject( payload ).promise()
			.then( data => {
				console.log('setOk', data );
			})
			.catch( error => {
				console.error('setError', error );
			})
		;
	},
	getContent( path: string ){
		const payload = {
			Bucket: BUCKET_NAME,
			Key: path
		}

		return S3.getObject( payload ).promise()
			.then( data => {
				console.log( 'getOk', data.Body.toString() )
			})
			.catch( err => {
				console.error( 'getError', err )
			})
	}
}

export default s3Helper;