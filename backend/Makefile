run:
	@export JWT_SECRET_KEY=change-me; \
	export DATABASE_URL=sqlite:///bailanysta.db; \
	PORT=$${PORT:-8000}; \
	exec gunicorn -w 2 -b 0.0.0.0:$$PORT wsgi:app
