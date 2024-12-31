CREATE TABLE IF NOT EXISTS review_post (
                                           id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    creation_date VARCHAR(255) NOT NULL,
    approved BOOLEAN NOT NULL,
    rejected_reason VARCHAR(255),
    PRIMARY KEY (id)
    );