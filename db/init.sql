CREATE TABLE comments (
  "id" int PRIMARY KEY DEFAULT unique_rowid(),
  "articleId" int not null,
  "userId" int not null,
  "comment" text not null,
  "likes" int not null default 0,
  "dislikes" int not null default 0,
  "reply" jsonb,
  "createdAt" timestamp not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamp not null default CURRENT_TIMESTAMP,
  FOREIGN KEY ("articleId") REFERENCES articles ("id"),
  FOREIGN KEY ("userId") REFERENCES users ("id")
);

CREATE TABLE users (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "firstName" string(50) not null,
  "lastName" string(50) not null,
  "email" string(100) not null,
  "passwordHash" string(100) not null,
  "createdAt" timestamp not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamp not null default CURRENT_TIMESTAMP,
  "role" string not null default 'user',
  "isVerified" boolean not null default false,
  CHECK ("role" in ('admin', 'author', 'user'))
);

CREATE TABLE articles (
  "id" int PRIMARY KEY DEFAULT unique_rowid(),
  "title" string(50) not null UNIQUE,
  "body" text not null,
  "userId" int not null,
  "categoryId" int not null,
  "createdAt" timestamp not null default CURRENT_TIMESTAMP,
  "updatedAt" timestamp not null default CURRENT_TIMESTAMP,
  "likes" int not null default 0,
  "dislikes" int not null default 0,
  FOREIGN KEY ("userId") REFERENCES users ("id"),
  FOREIGN KEY ("categoryId") REFERENCES categories ("id")
);

CREATE TABLE categories (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "title" string(50) NOT NULL UNIQUE
);
