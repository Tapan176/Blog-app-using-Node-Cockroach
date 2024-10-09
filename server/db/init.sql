CREATE TABLE "comments" (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "articleId" INT NOT NULL,
  "userId" INT NOT NULL,
  "comment" STRING NOT NULL,
  "likes" INT NOT NULL DEFAULT 0,
  "dislikes" INT NOT NULL DEFAULT 0,
  "reply" JSONB NOT NULL DEFAULT {},
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("articleId") REFERENCES articles ("id"),
  FOREIGN KEY ("userId") REFERENCES users ("id")
);

CREATE TABLE "users" (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "firstName" STRING(50) NOT NULL,
  "lastName" STRING(50) NOT NULL,
  "email" STRING(320) NOT NULL,
  "passwordHash" STRING NOT NULL,
  "createdAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
  "role" STRING NOT NULL DEFAULT 'user',
  "isVerified" boolean NOT NULL DEFAULT false,
  CONSTRAINT "cc_user_role" CHECK ("role" in ('admin', 'author', 'user'))
);

CREATE TABLE "articles" (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "title" STRING(50) NOT NULL UNIQUE,
  "body" STRING NOT NULL,
  "userId" INT NOT NULL,
  "categoryId" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "likes" INT NOT NULL DEFAULT 0,
  "dislikes" INT NOT NULL DEFAULT 0,
  FOREIGN KEY ("userId") REFERENCES users ("id"),
  FOREIGN KEY ("categoryId") REFERENCES categories ("id")
);

CREATE TABLE "categories" (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "title" STRING(50) NOT NULL UNIQUE
);

CREATE TABLE "likedAndDisliked" (
  "id" INT PRIMARY KEY DEFAULT unique_rowid(),
  "userId" INT NOT NULL, 
  "blogsLiked" INT ARRAY, 
  "blogsDisliked" INT ARRAY, 
  FOREIGN KEY ("userId") REFERENCES users ("id")
);

CREATE TABLE "likedBlog" (
  "userId" INT NOT NULL,
  "blogId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES USERS ("id"),
  FOREIGN KEY ("blogId") REFERENCES ARTICLES ("id")
);

CREATE TABLE "DISLIKEDBLOG" (
  "userId" INT NOT NULL,
  "blogId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES USERS ("id"),
  FOREIGN KEY ("blogId") REFERENCES ARTICLES ("id")
);

CREATE TABLE "authorRatings" (
  "userId" INT NOT NULL, 
  "authorId" INT NOT NULL, 
  "rating" INT NOT NULL, 
  FOREIGN KEY ("userId") REFERENCES "users" ("id"), 
  FOREIGN KEY ("authorId") REFERENCES "users" ("id"), 
  CONSTRAINT "cc_user_rating" CHECK ("rating" > 0 AND "rating" < 6)
);
