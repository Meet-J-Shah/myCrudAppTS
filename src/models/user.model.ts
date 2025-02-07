import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '.';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin';

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
          unique: true,
        },
        email: {
          allowNull: false,
          unique: true,
          type: DataTypes.STRING,
        },
        password: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        role: {
          type: DataTypes.ENUM('user', 'admin'),
          defaultValue: 'user',
        },
      },
      {
        sequelize,
        modelName: 'User',
        timestamps: true, // Automatically adds createdAt & updatedAt
      },
    );
  }
}

export default User;
