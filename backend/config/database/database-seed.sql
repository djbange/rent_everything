------------------------- SOFTWARE ENGINEERING DATABASE -------------------------
-- Relation schemas and instances for Project
CREATE SEQUENCE special_seq;
CREATE TABLE User_Details(UserID text PRIMARY KEY DEFAULT 'USER'||to_char(nextval('special_seq'), 'FM0000'),
							Email text,
							Password text,
							AuthMethod text,
							LoginType text,
							Token text,
							Verified boolean
							--primary key (Username)
							);

-------------------------------------------------------------------------
CREATE SEQUENCE special_seq1;
CREATE TABLE Customer_Profile(CustomerId text PRIMARY KEY DEFAULT 'CUST'||to_char(nextval('special_seq1'), 'FM0000'),
							UserID text,
							Name text,
							Dob DATE,
							Address text,
							PinCode text,
							PhoneNumber text,
							foreign key (UserID) references User_Details(UserID));



-------------------------------------------------------------------------
CREATE SEQUENCE special_seq2;
CREATE TABLE Renter_Profile(RenterId text PRIMARY KEY DEFAULT 'RENT'||to_char(nextval('special_seq2'), 'FM0000'),
							UserID text,
							Name text,
							Address text,
							PinCode text,
							PhoneNumber text,
							--primary key (RenterId),
							foreign key (UserID) references User_Details(UserID));

-------------------------------------------------------------------------
CREATE SEQUENCE special_seq3;
CREATE TABLE Property(ProductId text PRIMARY KEY DEFAULT 'PROD'||to_char(nextval('special_seq3'), 'FM0000'),
						RenterId text,
						ProductType text,
						Amount float4,
						ProductSpecification text,
						DefaultImageLink text,	
						Zipcode text,
						Address text,
						Latitude float,
						Longitude float,
						--primary key (ProductId),
						foreign key (RenterId) references Renter_Profile(RenterId));

-------------------------------------------------------------------------
CREATE SEQUENCE special_seq4;
CREATE TABLE Customer_OrderHistory(OrderId text PRIMARY KEY DEFAULT 'ORDER'||to_char(nextval('special_seq4'), 'FM0000'),
									UserId text,
									ProductId text,
									Status text, --(created, completed, cancelled, refunded, failed)
									StartDate DATE,
									EndDate DATE,
									PaypalPaymentId text,
									PaypalToken text,
									AmountPaid float4,
									LastUpdated TIMESTAMP,
									foreign key (UserId) references User_Details(UserId),
									foreign key (ProductId) references Property(ProductId));

-------------------------------------------------------------------------							 


CREATE SEQUENCE special_seq5;
CREATE TABLE otp(UserId text,
				Role text,
				CreatedDate TIMESTAMP,
				foreign key (UserId) references User_Details(UserId));

-------------------------------------------------------------------------							

CREATE TABLE PropertyImage(ProductId text,
							ImageLink text,
							primary key (ProductId, ImageLink),
							foreign key (ProductId) references Property(ProductId));

-------------------------------------------------------------------------

CREATE SEQUENCE special_seq7;								
							
CREATE TABLE BookingDetail(BookingId text DEFAULT 'BOOK'||to_char(nextval('special_seq7'), 'FM0000'),
							OrderId text,
							AmountPaid float4,
							ProductId text,
							RenterId text,
							primary key (BookingId, OrderId)
							);			 
-------------------------------------------------------------------------							
							
CREATE TABLE Review(ProductId text,
					CustomerId text,
					Rating integer,
					Comments text,
					ReviewDate DATE,
					primary key (ProductId, CustomerId));


-------------------------------------------------------------------------
CREATE TABLE Complaints(UserID text,
						ProductId text,
						Complaint text,
						ComplaintDate DATE,
						ComplaintStatus text);
-------------------------------------------------------------------------
						
CREATE MATERIALIZED VIEW Average_Rating AS 
    SELECT  ProductId, round(avg(Rating)::numeric,1) as Rating
    FROM    Review
	GROUP BY ProductId;

-------------------------------------------------------------------------

CREATE TABLE Zip(Country text,
				Zip text,
				Place_Name text,
				admin_name1 text,
				admin_code1 text,
				admin_name2 text,
				admin_code2 text,
				admin_name3 text,
				admin_code3 text,
				latitude float,
				longitude float,
				accuracy int
				);