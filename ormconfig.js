module.exports = {
  type:  'postgres',
  host:  'localhost',
  port: 5432,
  username:  'postgres',
  password:  'postgres',
  database:  'nestdb',
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
};