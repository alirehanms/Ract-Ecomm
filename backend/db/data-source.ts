import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'ReactEc',
  entities: ['dist/**/*.entity{.ts,.js}'],
  //   migrations: ['dist/db/migrations/*.js'],
  //   migrationsTableName: 'migration_table',

  logging: true,
  synchronize: true,
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
