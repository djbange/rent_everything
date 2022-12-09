INSERT INTO User_Details (Email, Password, AuthMethod, LoginType, Verified) VALUES
     ('johnj@gmail.com', 'amQwIzUqcXc=', 'Website', 'Customer', '1'),
     ('amitk@gmail.com', 'ZHNhKmFzMg==', 'Website', 'Customer', '1'),
     ('dipakb@gmail.com', 'a2pmYWQmMw==', 'Website', 'Customer', '1'),
	 ('sb-xqcgy21018947@business.example.com', 'ZGFzZCMhMw==', 'Website', 'Renter', '1'),
	 ('sb-zeoez21018945@business.example.com', 'cXdlJGRkcTE=', 'Website', 'Renter', '1'),
	 ('sb-st8x921018941@business.example.com', 'dWcmdmZ3MzI=', 'Website', 'Renter', '1'),
	 ('sb-btsmz21018938@business.example.com', 'c2RnaCNxMzI=', 'Website', 'Renter', '1'),
	 ('sb-dhzun21271933@business.example.com', 'YWRzaHYjZGg=', 'Website', 'Renter', '1'),
	 ('sb-xqhza21269018@business.example.com', 'YXNoZGclMjM=', 'Website', 'Renter', '1'),
	 ('sb-xh1ju20600856@business.example.com', 'ZGFzaGdANjU=', 'Website', 'Renter', '1'),
	 ('sb-tmhed20460359@business.example.com', 'dGhhb0A1MA==', 'Website', 'Renter', '1'),
     ('sb-ymq6d20460372@business.example.com', 'aGVucnlANzU=', 'Website', 'Renter', '1'),
     ('sb-4343vcj20460393@business.example.com', 'aXJpc0AyMA==', 'Website', 'Renter', '1'),
     ('sb-ydttg20460401@business.example.com', 'YWRhbUA4OA==', 'Website', 'Renter', '1'),
     ('sb-i7be4320460405@business.example.com', 'YnJpQDEw', 'Website', 'Renter', '1'),
     ('sb-qzh8t20460409@business.example.com', 'emVla0AxMA==', 'Website', 'Renter', '1'),
     ('sb-livjs20460410@business.example.com', 'bWFubnlAMTM=', 'Website', 'Renter', '1'),
     ('sb-h47n4f20460411@business.example.com', 'bm9haEAyMQ==', 'Website', 'Renter', '1');
	 
--------------------------------------
INSERT INTO Customer_Profile (UserID, Name, Dob, Address, PinCode, PhoneNumber) VALUES
	('USER0001', 'John', '2000-08-22', 'Fountain Park','47408','812546987'),
	('USER0002', 'Amit', '1998-07-04', 'Monroe Apartment', '47401','812658975'),
	('USER0003', 'Dipak', '1999-08-21', '4 Carson Hicksville', '11590', '7015689764');
	
--------------------------------------
INSERT INTO Renter_Profile (UserID, Name, Address, PinCode, PhoneNumber) VALUES
	('USER0004', 'Shalini','Woodbridge Apartment','47408','812546789'),
	('USER0005', 'Logan', 'Quarry Apartment', '47403','812679647'),
	('USER0006', 'Amy Michael', 'Brooklyn, New York, United States', '11201', '9137569845'),
	('USER0007', 'Daniel', 'Brooklyn, New York, United States', '10037', '9137569845'),
	('USER0008', 'Bryan', 'Queens, New York, United States', '11371', '8489756824'),
	('USER0009', 'Sam', 'Miami Beach, Florida, United States', '33109', '9127863286'),
	('USER0010', 'Amber', 'Malibu, California, United States','90263', '7348965874'),
	('USER0011', 'Thao', 'San Jose, California, United States','95128', '7248965880'),
    ('USER0012', 'Henry', 'San Jose, California, United States','95110', '9654965880'),
    ('USER0013', 'Iris', 'San Jose, California, United States','95128', '9714565880'),
    ('USER0014', 'Adam', 'Chicago, United States','60654', '8123456363'),
    ('USER0015', 'Brian', 'Chicago, United States','60614', '8125467360'),
    ('USER0016', 'Zeek', 'Bloomington,Indiana, United States','47408', '8129876541'),
    ('USER0017', 'Manny', 'Bloomington,Indiana, United States','47401', '8123632828'),
    ('USER0018', 'Noah', 'Bloomington,Illinois, United States','61701', '8187654561');
	
--------------------------------------
INSERT INTO Property (RenterId, ProductType, Amount, ProductSpecification, DefaultImageLink, Zipcode, Address, Latitude, Longitude) VALUES
	('RENT0001', 'House', 900, 'INDEPENDENT', 'mir1r6o', '47401', 'Monroe Apartments', 39.1697, 86.4943),
	('RENT0002', 'Car', 1200, 'AUDI X9', 'lmy09aF', '47403', 'Biddle Hotel', 39.1697, 86.4943),
	('RENT0003', 'House', 3500, '2 guests1 bedroom2 beds1 bath', 'UqBriUU','11201', 'Artist Retreat and private Garden', 40.675768170735886, -73.95144748904443),
	('RENT0004', 'House', 2200, '1 guest1 bedroom1 bed1 bath', 'kTifMBV', '10037', 'Lovely 1 studio apartment in Harlem New York City', 40.815793642522415, -73.95032029988656),
	('RENT0005', 'House', 1400, 'Private room in rental unit, 1 guest1 bedroom1 bed1 shared bath', 'dAmxjDP', '11371', 'Queens, New York, United States', 40.746481251798855, -73.86403016028363),
	('RENT0006', 'Boat', 300, 'Boat, 5 guests2 bedrooms2 beds1 bath', 'ZJIc4pG', '33109', 'Miami Beach, Florida, United States', 25.818260352111892, -80.12779013319329),
	('RENT0007', 'House', 18500, 'Malibu Beach Home Best Kept Secret *private beach*, 4 guests2 bedrooms2 beds1 bath', 'HnUr6kf',  '90263', 'Malibu, California, United States', 34.034068587739355, -118.67927177215394),
	('RENT0008', 'House', 1800, 'Entire guest suite, 2 guests studio 1 beds 1 bath', 'p35oBtA',  '95128', 'San Jose, California, United States', 37.32006182458623, -121.94834430212406),
    ('RENT0009', 'House', 2200, 'Entire guesthouse, 1 guest 1 bed 1 bath', '4nwaTsr',  '95110', 'San Jose, California, United States', 37.344690610857704, -121.89987675293037),
    ('RENT0010', 'House', 1100, 'Private room in home, 3 guests 2 beds 1 bath', 'XQFoBt9',  '95128', 'San Jose, California, United States', 37.313350043336314, -121.93833391984876),
    ('RENT0011', 'Car', 900, 'Nissan Pathfinder', 'rNA5IOG', '60654', 'Ohio Apartments, Chicago, United States', 41.96687035293481, -87.631456057146),
    ('RENT0012', 'Car', 2000, 'BMW X6', 'tcxOPJ2', '60614', 'Elevate Apartments, Chicago, United States', 42.02983883031508, -87.63498675686475),
    ('RENT0013', 'Skilled Worker', 60, 'Maintenance - Plumber/Drain', 'lvykBA2', '47408', 'Advanced Company , Bloomington, Indiana, United States', 39.22433080035096, -86.48587739767626),
    ('RENT0014', 'Boat', 500, 'Boat, 12 people', 'StIgqr9', '47401', 'Bloomington, Indiana, United States', 39.15202999313359, -86.4937922193519),
    ('RENT0015', 'Boat', 300, 'Boat, 6 people', 'JUNyhfy', '41701', 'Bloomington, Illinois, United States', 40.494594335754485, -88.95819300066029);

--------------------------------------
INSERT INTO Customer_OrderHistory(UserId,ProductId,Status,StartDate,EndDate) VALUES
						('USER0001', 'PROD0001','COMPLETED','2022-10-10','2022-10-15'),
						('USER0002', 'PROD0002','CANCELLED','2021-10-10','2021-10-13');

--------------------------------------
INSERT INTO PropertyImage VALUES('PROD0003', 'UqBriUU'),
						 ('PROD0003', 'rneZ4AO'),
						 ('PROD0003', 'eYZedGp'),
						 ('PROD0003', 'xkAaWOv'),
						 ('PROD0004', 'kTifMBV'),
						 ('PROD0004', 'VhF5GJL'),
						 ('PROD0004', 'fJFBnu6'),
						 ('PROD0004', '7n6LyhP'),
						 ('PROD0005', 'dAmxjDP'),
						 ('PROD0005', '7VBEEw4'),
						 ('PROD0005', 'EUkhpWk'),
						 ('PROD0006', 'ZJIc4pG'),
						 ('PROD0006', '9xyO6CM'),
						 ('PROD0006', 'kbX596i'),
						 ('PROD0007', 'HnUr6kf'),
						 ('PROD0007', 'Vau7Fzx'),
						 ('PROD0007', 'idpO85Z'),
                         ('PROD0008', 'p35oBtA'),
                         ('PROD0008', '6LjmWkl'),
                         ('PROD0008', 'qt6WDMK'),
                         ('PROD0009', '4nwaTsr'),
                         ('PROD0009', '0Hw7atU'),
                         ('PROD0009', 'dmbzjew'),
                         ('PROD0010', 'XQFoBt9'),
                         ('PROD0010', 'Ut6hGma'),
                         ('PROD0010', 'pr60lWh'),
                         ('PROD0011', 'rNA5IOG'),
                         ('PROD0011', 'I5pomZd'),
                         ('PROD0012', 'tcxOPJ2'),
                         ('PROD0012', '5j3xljP'),
                         ('PROD0013', 'lvykBA2'),
                         ('PROD0014', 'StIgqr9'),
                         ('PROD0015', 'JUNyhfy');
--------------------------------------
INSERT INTO BookingDetail(OrderId,AmountPaid,ProductId,RenterId) VALUES
					('ORDER0001',900,'PROD0001','RENT0001'),
					('ORDER0002',1200,'PROD0002','RENT0002');
					
					
--------------------------------------
INSERT INTO Review(ProductId,CustomerId,Rating,Comments,ReviewDate) VALUES
				('PROD0001','CUST0001',4,'GOOD', '2022-10-13'), 
				('PROD0002','CUST0002',3,'SATISFACTORY', '2022-10-15'),
				('PROD0003', 'CUST0003', 5,'Excellent location, good restaurants nearby, host will make sure any question gets answered. A great place to enjoy Manhattan and Brooklyn.', '2022-11-01'),
				('PROD0003', 'CUST0002', 4, 'Very cozy home that was clean and accommodating, in a great location with lots of fun only blocks away.', '2022-10-01'),
				('PROD0004','CUST0001',5,'Wonderful place. If you are nostalgic for old New York, this is the place for you. Very good price for a full one bedroom.', '2022-10-15'),
				('PROD0004', 'CUST0003', 4, 'Good host. Very friendly and accommodating. The place was as expected.', '2022-09-12'),
				('PROD0005', 'CUST0001', 5, 'Nice place to stay with great hosts. Recommend it, as it is great place.', '2022-10-10'),
				('PROD0005', 'CUST0002', 3, 'Very clean and nice hosting service!', '2022-08-15'),
				('PROD0006', 'CUST0002', 5, 'What an amazing experience we will never forget!!', '2022-11-01'),
				('PROD0007', 'CUST0003', 5, 'Ambers place is a fantastic experience. Very unique space!', '2022-10-01'),
				('PROD0008', 'CUST0001', 4, 'This place is super comfortable and clean. I really enjoyed my stay!', '2022-11-01'),
                ('PROD0008', 'CUST0002', 5, 'This unit was great! We knew exactly what to expect and how to check in. Everything was smooth and overall wonderful. We would love to stay there again!', '2022-10-01'),
                ('PROD0009', 'CUST0001', 5, 'Great place to stay in San Jose. Cozy little room that has everything that you need for your trip. Highly recommended!', '2022-11-01'),
                ('PROD0010', 'CUST0001', 4, 'Check in details are helpful. The hosts are very responsive. Bed is comfortable.', '2022-09-01'),
				('PROD0010', 'CUST0002', 4, 'Great place to stay in the area over the weekend!!! Highly recommended!!!', '2022-07-01'),
                ('PROD0011','CUST0001',5,'EXCELLENT', '2022-06-15'),
                ('PROD0012','CUST0001',4,'GOOD', '2022-04-15'),
                ('PROD0013','CUST0001',4,'GOOD', '2022-01-10'),
                ('PROD0014','CUST0001',5,'EXCELLENT', '2021-11-20'),
                ('PROD0015','CUST0001',3,'SATISFACTORY', '2022-11-10'); 
				
-----------------------------------------
REFRESH MATERIALIZED VIEW average_rating;