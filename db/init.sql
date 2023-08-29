CREATE TABLE comments (
  id int(10) not null AUTO_INCREMENT,
  articleId int(10) not null,
  userId int(10) not null,
  body text(200),
  createdAt timestamp default CURRENT_TIMESTAMP,
  updatedAt timestamp default CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (articleId) REFERENCES articles (id),
  FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE users (
  id int not null AUTO_INCREMENT,
  username varchar(50),
  email varchar(100),
  password varchar(16),
  createdAt timestamp default CURRENT_TIMESTAMP,
  updatedAt timestamp default CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  isVerified boolean
);

CREATE TABLE articles (
  id int not null AUTO_INCREMENT,
  title varchar(50),
  body text(3000),
  userId int(10) not null,
  categoryId array not null,
  images array,
  createdAt timestamp default CURRENT_TIMESTAMP,
  updatedAt timestamp default CURRENT_TIMESTAMP,
  likes bigint(20),
  dislikes bigint(20),
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (categoryId) REFERENCES categories (id)
);

CREATE TABLE categories (
  id int not null AUTO_INCREMENT,
  title varchar(50),
  PRIMARY KEY (id)
);
