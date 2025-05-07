const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
	

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465, // if secure false port will be 587 , if true port will be 465
		secure: true, // true for 465, false for other ports
		auth: {
			user: 'boukra.abdellah0@gmail.com',
			pass: 'bfzfiehqsuhcyedk',
		},
		tls: {
			rejectUnauthorized: false, // reject
		},
	});
	// 2) Define email Options (like : from, to, subject,email content)
	const emailOptions = {
		from: `ESI-PFE <boukra.abdellah0@gmail.com>`,
		to: options.email,
		subject: options.subject,
		html: options.message,
	};
	// 3) send email
	await transporter.sendMail(emailOptions);
};

module.exports = {sendEmail};


// [
//   {
//     _id: ObjectId('6813a5158923757c10a18d92'),
//     themeId: 1,
//     teacher: { id: 6, name: 'Pr. F', email: 'f@esi-sba.dz', note: null },
//     student1: { id: 101, email: 'sara@esii-sba.dz', name: 'Sara' },
//     student2: { id: 107, name: 'Nour', email: 'nour@esii-sba.dz' },
//     jury: [
//       {
//         id: 1,
//         name: 'Pr. A',
//         email: 'kadriayoub122@gmail.com',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d93')
//       },
//       {
//         id: 3,
//         name: 'Pr. C',
//         email: 'c@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d94')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '08:00',
//     endTime: '10:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18d95'),
//     themeId: 2,
//     teacher: {
//       id: 1,
//       name: 'Pr. A',
//       email: 'kadriayoub122@gmail.com',
//       note: null
//     },
//     student1: { id: 106, email: 'amine@esii-sba.dz', name: 'Amine' },
//     student2: { id: 102, name: 'Karim', email: 'karim@esii-sba.dz' },
//     jury: [
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d96')
//       },
//       {
//         id: 5,
//         name: 'Pr. E',
//         email: 'e@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d97')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '10:00',
//     endTime: '12:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18d98'),
//     themeId: 3,
//     teacher: { id: 8, name: 'Pr. H', email: 'h@esi-sba.dz', note: null },
//     student1: { id: 102, email: 'karim@esii-sba.dz', name: 'Karim' },
//     student2: { id: 104, name: 'Nabil', email: 'nabil@esii-sba.dz' },
//     jury: [
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d99')
//       },
//       {
//         id: 1,
//         name: 'Pr. A',
//         email: 'kadriayoub122@gmail.com',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d9a')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '13:00',
//     endTime: '15:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18d9b'),
//     themeId: 4,
//     teacher: { id: 2, name: 'Pr. B', email: 'b@esi-sba.dz', note: null },
//     student1: { id: 104, email: 'nabil@esii-sba.dz', name: 'Nabil' },
//     student2: { id: 107, name: 'Nour', email: 'nour@esii-sba.dz' },
//     jury: [
//       {
//         id: 6,
//         name: 'Pr. F',
//         email: 'f@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d9c')
//       },
//       {
//         id: 3,
//         name: 'Pr. C',
//         email: 'c@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d9d')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '10:00',
//     endTime: '12:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18d9e'),
//     themeId: 5,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 104, email: 'nabil@esii-sba.dz', name: 'Nabil' },
//     student2: { id: 103, name: 'Lina', email: 'lina@esii-sba.dz' },
//     jury: [
//       {
//         id: 2,
//         name: 'Pr. B',
//         email: 'b@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18d9f')
//       },
//       {
//         id: 6,
//         name: 'Pr. F',
//         email: 'f@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da0')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '13:00',
//     endTime: '15:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18da1'),
//     themeId: 6,
//     teacher: { id: 3, name: 'Pr. C', email: 'c@esi-sba.dz', note: null },
//     student1: { id: 101, email: 'sara@esii-sba.dz', name: 'Sara' },
//     student2: { id: 103, name: 'Lina', email: 'lina@esii-sba.dz' },
//     jury: [
//       {
//         id: 6,
//         name: 'Pr. F',
//         email: 'f@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da2')
//       },
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da3')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '15:00',
//     endTime: '17:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18da4'),
//     themeId: 7,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 102, email: 'karim@esii-sba.dz', name: 'Karim' },
//     student2: { id: 107, name: 'Nour', email: 'nour@esii-sba.dz' },
//     jury: [
//       {
//         id: 8,
//         name: 'Pr. H',
//         email: 'h@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da5')
//       },
//       {
//         id: 7,
//         name: 'Pr. G',
//         email: 'g@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da6')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '08:00',
//     endTime: '10:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18da7'),
//     themeId: 8,
//     teacher: { id: 2, name: 'Pr. B', email: 'b@esi-sba.dz', note: null },
//     student1: { id: 100, email: 'ay.kadri@esi-sba.dz', name: 'Ayyoub' },
//     student2: { id: 103, name: 'Lina', email: 'lina@esii-sba.dz' },
//     jury: [
//       {
//         id: 8,
//         name: 'Pr. H',
//         email: 'h@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da8')
//       },
//       {
//         id: 5,
//         name: 'Pr. E',
//         email: 'e@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18da9')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-01T00:00:00.000Z'),
//     startTime: '15:00',
//     endTime: '17:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18daa'),
//     themeId: 9,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 100, email: 'ay.kadri@esi-sba.dz', name: 'Ayyoub' },
//     student2: { id: 105, name: 'Yasmine', email: 'yasmine@esii-sba.dz' },
//     jury: [
//       {
//         id: 1,
//         name: 'Pr. A',
//         email: 'kadriayoub122@gmail.com',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dab')
//       },
//       {
//         id: 8,
//         name: 'Pr. H',
//         email: 'h@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dac')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-02T00:00:00.000Z'),
//     startTime: '08:00',
//     endTime: '10:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dad'),
//     themeId: 10,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 103, email: 'lina@esii-sba.dz', name: 'Lina' },
//     student2: { id: 102, name: 'Karim', email: 'karim@esii-sba.dz' },
//     jury: [
//       {
//         id: 6,
//         name: 'Pr. F',
//         email: 'f@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dae')
//       },
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18daf')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-02T00:00:00.000Z'),
//     startTime: '10:00',
//     endTime: '12:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18db0'),
//     themeId: 11,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 101, email: 'sara@esii-sba.dz', name: 'Sara' },
//     student2: { id: 102, name: 'Karim', email: 'karim@esii-sba.dz' },
//     jury: [
//       {
//         id: 8,
//         name: 'Pr. H',
//         email: 'h@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18db1')
//       },
//       {
//         id: 7,
//         name: 'Pr. G',
//         email: 'g@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18db2')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-02T00:00:00.000Z'),
//     startTime: '13:00',
//     endTime: '15:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18db3'),
//     themeId: 12,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 104, email: 'nabil@esii-sba.dz', name: 'Nabil' },
//     student2: { id: 107, name: 'Nour', email: 'nour@esii-sba.dz' },
//     jury: [
//       {
//         id: 3,
//         name: 'Pr. C',
//         email: 'c@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18db4')
//       },
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18db5')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-02T00:00:00.000Z'),
//     startTime: '15:00',
//     endTime: '17:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18db6'),
//     themeId: 13,
//     teacher: { id: 8, name: 'Pr. H', email: 'h@esi-sba.dz', note: null },
//     student1: { id: 106, email: 'amine@esii-sba.dz', name: 'Amine' },
//     student2: { id: 104, name: 'Nabil', email: 'nabil@esii-sba.dz' },
//     jury: [
//       {
//         id: 7,
//         name: 'Pr. G',
//         email: 'g@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18db7')
//       },
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18db8')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-03T00:00:00.000Z'),
//     startTime: '08:00',
//     endTime: '10:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18db9'),
//     themeId: 14,
//     teacher: {
//       id: 1,
//       name: 'Pr. A',
//       email: 'kadriayoub122@gmail.com',
//       note: null
//     },
//     student1: { id: 102, email: 'karim@esii-sba.dz', name: 'Karim' },
//     student2: { id: 100, name: 'Ayyoub', email: 'ay.kadri@esi-sba.dz' },
//     jury: [
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dba')
//       },
//       {
//         id: 5,
//         name: 'Pr. E',
//         email: 'e@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dbb')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-03T00:00:00.000Z'),
//     startTime: '10:00',
//     endTime: '12:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dbc'),
//     themeId: 15,
//     teacher: { id: 3, name: 'Pr. C', email: 'c@esi-sba.dz', note: null },
//     student1: { id: 101, email: 'sara@esii-sba.dz', name: 'Sara' },
//     student2: { id: 105, name: 'Yasmine', email: 'yasmine@esii-sba.dz' },
//     jury: [
//       {
//         id: 1,
//         name: 'Pr. A',
//         email: 'kadriayoub122@gmail.com',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dbd')
//       },
//       {
//         id: 2,
//         name: 'Pr. B',
//         email: 'b@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dbe')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-02T00:00:00.000Z'),
//     startTime: '10:00',
//     endTime: '12:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dbf'),
//     themeId: 16,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 106, email: 'amine@esii-sba.dz', name: 'Amine' },
//     student2: { id: 102, name: 'Karim', email: 'karim@esii-sba.dz' },
//     jury: [
//       {
//         id: 7,
//         name: 'Pr. G',
//         email: 'g@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc0')
//       },
//       {
//         id: 6,
//         name: 'Pr. F',
//         email: 'f@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc1')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-03T00:00:00.000Z'),
//     startTime: '13:00',
//     endTime: '15:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dc2'),
//     themeId: 17,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 106, email: 'amine@esii-sba.dz', name: 'Amine' },
//     student2: { id: 105, name: 'Yasmine', email: 'yasmine@esii-sba.dz' },
//     jury: [
//       {
//         id: 1,
//         name: 'Pr. A',
//         email: 'kadriayoub122@gmail.com',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc3')
//       },
//       {
//         id: 7,
//         name: 'Pr. G',
//         email: 'g@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc4')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-03T00:00:00.000Z'),
//     startTime: '15:00',
//     endTime: '17:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dc5'),
//     themeId: 18,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 106, email: 'amine@esii-sba.dz', name: 'Amine' },
//     student2: { id: 104, name: 'Nabil', email: 'nabil@esii-sba.dz' },
//     jury: [
//       {
//         id: 3,
//         name: 'Pr. C',
//         email: 'c@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc6')
//       },
//       {
//         id: 4,
//         name: 'Pr. D',
//         email: 'd@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc7')
//       }
//     ],
//     roomId: ObjectId('6813a532c6602c3fc3beb489'),
//     date: ISODate('2025-06-04T00:00:00.000Z'),
//     startTime: '08:00',
//     endTime: '10:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dc8'),
//     themeId: 19,
//     teacher: { id: 7, name: 'Pr. G', email: 'g@esi-sba.dz', note: null },
//     student1: { id: 105, email: 'yasmine@esii-sba.dz', name: 'Yasmine' },
//     student2: { id: 101, name: 'Sara', email: 'sara@esii-sba.dz' },
//     jury: [
//       {
//         id: 1,
//         name: 'Pr. A',
//         email: 'kadriayoub122@gmail.com',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dc9')
//       },
//       {
//         id: 2,
//         name: 'Pr. B',
//         email: 'b@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dca')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-02T00:00:00.000Z'),
//     startTime: '15:00',
//     endTime: '17:00',
//     note: null,
//     __v: 0
//   },
//   {
//     _id: ObjectId('6813a5158923757c10a18dcb'),
//     themeId: 20,
//     teacher: { id: 5, name: 'Pr. E', email: 'e@esi-sba.dz', note: null },
//     student1: { id: 105, email: 'yasmine@esii-sba.dz', name: 'Yasmine' },
//     student2: { id: 101, name: 'Sara', email: 'sara@esii-sba.dz' },
//     jury: [
//       {
//         id: 2,
//         name: 'Pr. B',
//         email: 'b@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dcc')
//       },
//       {
//         id: 3,
//         name: 'Pr. C',
//         email: 'c@esi-sba.dz',
//         note: null,
//         _id: ObjectId('6813a5158923757c10a18dcd')
//       }
//     ],
//     roomId: ObjectId('6813a537c6602c3fc3beb48c'),
//     date: ISODate('2025-06-03T00:00:00.000Z'),
//     startTime: '08:00',
//     endTime: '10:00',
//     note: null,
//     __v: 0
//   }
// ]
// test> 
// (To exit, press Ctrl+C again or Ctrl+D or type .exit)
// test> 