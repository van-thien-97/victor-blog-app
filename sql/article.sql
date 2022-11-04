DROP TABLE public.article
GO
CREATE TABLE public.article(
	id  SERIAL PRIMARY KEY ,
	title VARCHAR(255) NOT NULL,
	description VARCHAR(500),
	markdown VARCHAR NOT NULL,
	createdAt DATE DEFAULT NOW() NOT NULL,
	updatedAt DATE DEFAULT NOW() NOT NULL,
	slug VARCHAR(260) NOT NULL,
	sanitizedHtml VARCHAR NOT NULL
)


SELECT id, title, description, markdown, createdat, updatedat, slug, sanitizedhtml
FROM public.article;


INSERT INTO public.article(
id, title, description, markdown, createdat, updatedat, slug, sanitizedhtml)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

SELECT id, title, description, markdown, createdat, updatedat, slug, sanitizedhtml
FROM public.article
WHERE slug = $1;

DELETE FROM public.article
WHERE id = $1


UPDATE public.article
SET  title=$1, description=$2, markdown=$3, createdat=$4, updatedat=$5, slug=$6, sanitizedhtml=$7
WHERE ;

ALTER TABLE PUBLIC.article 
ADD imagename VARCHAR(250)