import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Exchange } from 'src/entities/exchange.entity';
import { Income } from 'src/entities/income.entity';
import { Users } from 'src/entities/user.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from 'src/dto/editUser.dto';
import { SearchUserDto } from 'src/dto/searchUser.dto';

export interface StatisticCategories {
  food: number,
  education: number,
  entertainment: number,
  clothes: number,
  invest: number,
  other: number,
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Exchange) private exchangeRepository: Repository<Exchange>,
    @InjectRepository(Budget) private budgetRepository: Repository<Budget>,
    @InjectRepository(Income) private incomeRepository: Repository<Income>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwtService: JwtService
  ) { }

  async getUserName(cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY })
    return payload.userName;
  }

  async listOfUsers(mode: string, isDeletedOption: boolean) {
    var data;
    switch (mode) {
      case 'all':
        data = await this.usersRepository.find({
          where: {
            isDeleted: isDeletedOption,
          }
        });
        break;
      case 'Student':
        data = await this.usersRepository.find({
          where: {
            profession: 'Student',
            isDeleted: isDeletedOption,
          }
        });
        break;
      case 'IT':
        data = await this.usersRepository.find({
          where: {
            profession: 'IT',
            isDeleted: isDeletedOption,
          }
        });
        break;
      case 'Doctor':
        data = await this.usersRepository.find({
          where: {
            profession: 'Doctor',
            isDeleted: isDeletedOption,
          }
        });
        break;
      case 'Teacher':
        data = await this.usersRepository.find({
          where: {
            profession: 'Teacher',
            isDeleted: isDeletedOption,
          }
        });
        break;
      case 'Worker':
        data = await this.usersRepository.find({
          where: {
            profession: 'Worker',
            isDeleted: isDeletedOption,
          }
        });
        break;
      case 'Other':
        data = await this.usersRepository.find({
          where: {
            profession: 'Other',
            isDeleted: isDeletedOption,
          }
        });
        break;
      default:
        break;
    }
    return data;
  }

  async deleteUserSoft(id: number) {
    return await this.usersRepository.update({
      id: id
    }, {
      isDeleted: true
    })
  }

  async deleteUserHard(id: number) {
    await this.budgetRepository.delete({
      user_id: id
    });
    await this.incomeRepository.delete({
      user_id: id
    });
    await this.exchangeRepository.delete({
      user_id: id
    });
    return await this.usersRepository.delete({
      id: id
    })
  }

  async restoreUser(id: number) {
    return await this.usersRepository.update({
      id: id
    }, {
      isDeleted: false
    })
  }

  async resetPassword(id: number) {
    const hashedPassword = await bcrypt.hash('user123', 12);
    return await this.usersRepository.update({
      id: id
    }, {
      password: hashedPassword
    })
  }

  async getDataUserEdit(id: number) {
    const data = await this.usersRepository.findOneBy({
      id: id
    });
    return data;
  }

  async grantAdmin(id: number) {
    return await this.usersRepository.update({
      id: id
    }, {
      role: 'admin'
    })
  }

  async editUser(id: number, editUserDto: EditUserDto) {
    editUserDto.userName = editUserDto.userName.trim();
    editUserDto.fullName = editUserDto.fullName.trim();
    editUserDto.email = editUserDto.email.trim();
    return await this.usersRepository.update({
      id: id
    }, {
      userName: editUserDto.userName as string,
      fullName: editUserDto.fullName as string,
      gender: editUserDto.gender as string,
      email: editUserDto.email as string,
      date_of_birth: editUserDto.date_of_birth,
    })
  }

  async searchUsers(searchUserDto: SearchUserDto) {
    var data;
    var whereClause = {} as any;
    if (searchUserDto.id) {
      data = await this.usersRepository.find({where:{id: searchUserDto.id}});
    } else if (searchUserDto.userName) {
      data = await this.usersRepository.find({where: {userName: searchUserDto.userName.trim() as string}});
    } else {
      if (searchUserDto.gender) {
        whereClause.gender = searchUserDto.gender;
      }
      if (searchUserDto.profession) {
        whereClause.profession = searchUserDto.profession;
      }
      if (whereClause) {
        data = await this.usersRepository.find({});
      } else {
        data = await this.usersRepository.find({
          where: whereClause
        });
      }
    }

    return data;
  }

  async statisticJob(job: string) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 59);

    var data = {} as StatisticCategories;
    data.food = 0;
    data.education = 0;
    data.entertainment = 0;
    data.clothes = 0;
    data.invest = 0;
    data.other = 0;

    const usersData = await this.usersRepository.find({
      where: {
        profession: job
      }
    })

    if(job=='Student') {
      console.log(usersData);
    }

    for (let user of usersData) {
      const exchangeData = await this.exchangeRepository.find({
        where: {
          user_id: user.id,
          exchange_date: Between(firstDayOfMonth, lastDayOfMonth)
        }
      });
      
      for (let exchange of exchangeData) {
        switch (exchange.category_name) {
          case 'food':
            data.food += exchange.amount_of_money;
            break;
          case 'education':
            data.education += exchange.amount_of_money;
            break;
          case 'entertainment':
            data.entertainment += exchange.amount_of_money;
            break;
          case 'clothes':
            data.clothes += exchange.amount_of_money;
            break;
          case 'invest':
            data.invest += exchange.amount_of_money;
            break;
          case 'other':
            data.other += exchange.amount_of_money;
            break;
          default:
            break;
        }
      }
    }
    return data;
  }

  async dashboard() {
    var amountOfNewUsers, amountOfUsers, dataPieChart = {} as any, listPercentageEachJob = {} as any;
    var studentStatistic = {} as StatisticCategories, itStatistic = {} as StatisticCategories,
      doctorStatistic = {} as StatisticCategories, teacherStatistic = {} as StatisticCategories,
      workerStatistic = {} as StatisticCategories, otherStatistic = {} as StatisticCategories;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 59);

    const newUsersMonthly = await this.usersRepository.find({
      where: {
        createdAt: Between(firstDayOfMonth, lastDayOfMonth)
      }
    });
    amountOfNewUsers = newUsersMonthly.length;
    const totalUsers = await this.usersRepository.find({});
    amountOfUsers = totalUsers.length;

    dataPieChart.student = dataPieChart.it = dataPieChart.teacher = dataPieChart.doctor = dataPieChart.worker = dataPieChart.other = 0
    listPercentageEachJob.student = listPercentageEachJob.it = listPercentageEachJob.teacher = listPercentageEachJob.doctor = listPercentageEachJob.worker = listPercentageEachJob.other = 0

    for (let user of totalUsers) {
      switch (user.profession) {
        case 'Student':
          dataPieChart.student = dataPieChart.student + 1;
          listPercentageEachJob.student = listPercentageEachJob.student + 1;
          if ( Object.keys(studentStatistic).length === 0) {
            studentStatistic = await this.statisticJob('Student');
          }
          break;
        case 'IT':
          dataPieChart.it = dataPieChart.it + 1;
          listPercentageEachJob.it = listPercentageEachJob.it + 1;
          itStatistic = await this.statisticJob('IT');
          break;
        case 'Teacher':
          dataPieChart.teacher = dataPieChart.teacher + 1;
          listPercentageEachJob.teacher = listPercentageEachJob.teacher + 1;
          teacherStatistic = await this.statisticJob('Teacher');
          break;
        case 'Doctor':
          dataPieChart.doctor = dataPieChart.doctor + 1;
          listPercentageEachJob.doctor = listPercentageEachJob.doctor + 1;
          doctorStatistic = await this.statisticJob('Doctor');
          break;
        case 'Worker':
          dataPieChart.worker = dataPieChart.worker + 1;
          listPercentageEachJob.worker = listPercentageEachJob.worker + 1;
          workerStatistic = await this.statisticJob('Worker');
          break;
        case 'Other':
          dataPieChart.other = dataPieChart.other + 1;
          listPercentageEachJob.other = listPercentageEachJob.other + 1;
          otherStatistic = await this.statisticJob('Other');
          break;
        default:
          break;
      }
    }

    listPercentageEachJob.student = Math.floor((listPercentageEachJob.student / amountOfUsers) * 100);
    listPercentageEachJob.it = Math.floor((listPercentageEachJob.it / amountOfUsers) * 100);
    listPercentageEachJob.teacher = Math.floor((listPercentageEachJob.teacher / amountOfUsers) * 100);
    listPercentageEachJob.doctor = Math.floor((listPercentageEachJob.doctor / amountOfUsers) * 100);
    listPercentageEachJob.worker = Math.floor((listPercentageEachJob.worker / amountOfUsers) * 100);
    listPercentageEachJob.other = Math.floor((listPercentageEachJob.other / amountOfUsers) * 100);

    return {
      amountOfNewUsers,
      amountOfUsers,
      dataPieChart,
      listPercentageEachJob,
      studentStatistic,
      itStatistic,
      teacherStatistic,
      doctorStatistic,
      workerStatistic,
      otherStatistic
    }
  }

  async showDatabase() {
    const budgetTable = await this.budgetRepository.find();
    const exchangeTable = await this.exchangeRepository.find();
    const incomeTable = await this.incomeRepository.find();
    const usersTable = await this.usersRepository.find();
    return {budgetTable, exchangeTable, incomeTable, usersTable};
  }

  async getContact(cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY });
    const data = await this.usersRepository.findOneBy({
      id: payload.userID
    });
    return {
      yourName: data.fullName,
      yourEmail: data.email
    }
  }
}
