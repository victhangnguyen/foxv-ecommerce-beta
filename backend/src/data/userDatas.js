const userDatas = [
  {
    _id: '63ddf086f48acedfbe5db53d',
    name: 'victhangnguyen',
    doB: '1984-08-10T15:46:00.643Z',
    phoneNumber: '0397139377',
    email: 'victhangnguyen@gmail.com',
    password: 'victhangnguyen',
    status: 'active',
    role: 'admin',
  },
  {
    _id: '63ddf086f48acedfbe5db53e',
    name: 'Trần Việt Anh',
    doB: '1967-11-10T10:35:45.967Z',
    phoneNumber: '0915588699',
    email: 'tranvietanh@gmail.com',
    password: 'tvanh1967',
    status: 'active',
    role: 'admin',
  },
  {
    _id: '63ddf3bc751df7bb7533495a',
    name: 'Lương Quốc Cường',
    doB: '1974-06-12T00:10:31.862Z',
    phoneNumber: '0354567932',
    email: 'luongquoccuong@gmail.com',
    password: 'lqcuong1974',
    status: 'active',
    role: 'admin',
  },
  {
    _id: '63ddf465f8c7870ddde148ac',
    name: 'Phạm Thị Thanh Dung',
    doB: '1993-04-03T10:43:58.476Z',
    phoneNumber: '0578139472',
    email: 'thanhdung@gmail.com',
    password: 'pttdung1993',
    status: 'active',
    role: 'user',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddf4ba6d47e8f5f0da4e2d',
    name: 'Lê Minh Hoàng',
    doB: '1984-11-12T17:38:03.662Z',
    phoneNumber: '0492344969',
    email: 'leminhhoang@gmail.com',
    password: 'lmhoang1984',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddf54b3bdb0ab3268272f6',
    name: 'Nguyễn Văn Khang',
    doB: '2003-10-21T18:46:50.455Z',
    phoneNumber: '0931245999',
    email: 'nguyenvankhang@gmail.com',
    password: 'nvkhang2003',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddf59c52c5308878ba709b',
    name: 'Trần Bình Long',
    doB: '1986-11-13T10:46:23.885Z',
    phoneNumber: '0721495964',
    email: 'tranbinhlong@gmail.com',
    password: 'tblong1986',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddf5d48102117c490939ed',
    name: 'Nguyễn Đăng Khoa',
    doB: '1993-06-19T05:58:04.175Z',
    phoneNumber: '0395960946',
    email: 'nguyendangkhoa@gmail.com',
    password: 'ndkhoa1993',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddf60d2feb706fc621c3a9',
    name: 'Trần Duy Hưng',
    doB: '1987-05-25T08:09:20.539Z',
    phoneNumber: '0234655544',
    email: 'tranbinhlong@gmail.com',
    password: 'tdhung1987',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddfcd73f3dcf377a3ef1db',
    name: 'Nguyễn Nhật Tín',
    doB: '1991-11-26T09:27:29.574Z',
    phoneNumber: '0650133464',
    email: 'nguyennhattin@gmail.com',
    password: 'nntin1991',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddfd797197f95937b5296a',
    name: 'Nguyễn Ngọc Thiện',
    doB: '1996-05-25T04:33:37.042Z',
    phoneNumber: '0788888079',
    email: 'nguyenngocthien@gmail.com',
    password: 'nnthien1996',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddfe26b27bcc091cb5a9f2',
    name: 'Trần Huyền Trân',
    doB: '1971-06-04T00:39:59.387Z',
    phoneNumber: '0397156095',
    email: 'tranhuyentran@gmail.com',
    password: 'thtran1971',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddff5708a9e660cce1886e',
    name: 'Nguyễn Quốc Trí',
    doB: '1968-03-12T07:55:23.179Z',
    phoneNumber: '0397683961',
    email: 'nguyenquoctri@gmail.com',
    password: 'nqtri1968',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddff8bbf6767d4158ff56f',
    name: 'Nguyễn Quang Trung',
    doB: '1968-07-08T15:36:18.360Z',
    phoneNumber: '0650295186',
    email: 'nguyenquangtrung@gmail.com',
    password: 'nqtrung1968',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63ddffd955d17feb36f32da1',
    name: 'Lê Thế Vinh',
    doB: '1999-03-24T08:22:13.718Z',
    phoneNumber: '0492765888',
    email: 'lethevinh@gmail.com',
    password: 'ltvinh1999',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63de004e90b8bbfff6d25c49',
    name: 'Cao Hoàng Tuấn',
    doB: '2003-04-29T04:46:36.155Z',
    phoneNumber: '0421948593',
    email: 'caohoangtuan@gmail.com',
    password: 'chtuan2003',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63de0092ab325b65e50cbff1',
    name: 'Hoàng Thanh Phong',
    doB: '1995-06-29T22:16:34.381Z',
    phoneNumber: '0467830053',
    email: 'hoangthanhphong@gmail.com',
    password: 'htphong1995',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63de00e59783a916c85f01a8',
    name: 'Phạm Minh Hiếu',
    doB: '1979-03-29T21:12:02.799Z',
    phoneNumber: '06509390467',
    email: 'phamminhhieu@gmail.com',
    password: 'pmhieu1979',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63de0124b0f5d4a910ca9938',
    name: 'Phạm Tấn Tài',
    doB: '1986-08-17T07:22:04.304Z',
    phoneNumber: '0124758093',
    email: 'phamtantai@gmail.com',
    password: 'pttai1986',
    status: 'active',
    role: 'user',
  },
  {
    _id: '63de01647b72571c18627733',
    name: 'Nguyễn Thị Thùy Vân',
    doB: '1997-07-07T04:26:14.390Z',
    phoneNumber: '0395395054',
    email: 'nguyenthithuyvan@gmail.com',
    password: 'nttvan1997',
    status: 'active',
    role: 'user',
  },
];

export default userDatas;
