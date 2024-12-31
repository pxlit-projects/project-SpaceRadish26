CREATE TABLE IF NOT EXISTS post (
                                    id CHAR(36) NOT NULL,
    approved BOOLEAN NOT NULL,
    author VARCHAR(255) NOT NULL,
    concept BOOLEAN NOT NULL,
    content TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    rejected_reason TEXT,
    title VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS notification (
                                            id BIGINT AUTO_INCREMENT NOT NULL,
                                            content VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    post_name VARCHAR(255),
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS notification_seq (
                                                next_val BIGINT NOT NULL
);

INSERT INTO notification_seq (next_val) VALUES (0);