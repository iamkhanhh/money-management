import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTransactionDto } from 'src/dto/addTransaction.dto';
import { SearchTransactionDto } from 'src/dto/searchTransaction.dto';
import { Exchange } from 'src/entities/exchange.entity';
import { Repository } from 'typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Income } from 'src/entities/income.entity';
import { BudgetPlanDto } from 'src/dto/budgetPlan.dto';
import { AutoPlanningDto } from 'src/dto/autoPlanning.dto';
import { Users } from 'src/entities/user.entity';
import { InforReportDto } from 'src/dto/inforReportDto.dto';
import { createObjectCsvWriter } from 'csv-writer';
import * as moment from 'moment';
import * as fs from 'fs';

@Injectable()
export class FunctionsService {
  budgetAnalyze = {
    IT: {
      food: 0.25,
      education: 0.3,
      clothes: 0.1,
      entertainment: 0.2,
      invest: 0.05,
      other: 0.1
    },
    Student: {
      food: 0.3,
      education: 0.25,
      clothes: 0.1,
      entertainment: 0.2,
      invest: 0.05,
      other: 0.1
    },
    Doctor: {
      food: 0.25,
      education: 0.25,
      clothes: 0.1,
      entertainment: 0.15,
      invest: 0.1,
      other: 0.15
    },
    Teacher: {
      food: 0.3,
      education: 0.3,
      clothes: 0.1,
      entertainment: 0.15,
      invest: 0.05,
      other: 0.1
    },
    Worker: {
      food: 0.25,
      education: 0.2,
      clothes: 0.15,
      entertainment: 0.15,
      invest: 0.1,
      other: 0.15
    },
    Other: {
      food: 0.2,
      education: 0.2,
      clothes: 0.15,
      entertainment: 0.15,
      invest: 0.1,
      other: 0.2
    }
  };
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

  async exportToCsv(data: any[], userName: string) {

    const currentTime = moment().format('YYYYMMDDHHmmss');
    const nameToDownload = `${userName}-${currentTime}`;
    const fileName = `${userName}-${currentTime}.csv`;

    const records = data.map(exchange => ({
      user_id: exchange.user_id,
      transaction_name: exchange.name,
      payment_method: exchange.payment_method,
      category_name: exchange.category_name,
      amount_of_money: exchange.amount_of_money,
      exchange_date: exchange.exchange_date,
    }));

    // Tạo tệp CSV và ghi dữ liệu
    const csvWriter = createObjectCsvWriter({
      path: `exportSearching/${fileName}`,
      header: [
        { id: 'user_id', title: 'User ID' },
        { id: 'transaction_name', title: "Tracsaction's name" },
        { id: 'payment_method', title: 'payment_method' },
        { id: 'category_name', title: 'Category Name' },
        { id: 'amount_of_money', title: 'amount_of_money' },
        { id: 'exchange_date', title: 'exchange_date' },
      ],
    });
    
    await csvWriter.writeRecords(records);

    return nameToDownload
  }

  deleteFile(filePath: string): void {
    // Xóa tệp
    fs.unlinkSync(filePath);
  }

  async addTransaction(cookie: string, addTransactionDto: AddTransactionDto) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY })
    var isAdded = true;
    var exchangeDate;

    if (addTransactionDto.exchange_date) {
      exchangeDate = new Date(addTransactionDto.exchange_date);
    } else {
      exchangeDate = new Date();
    }

    var checkBudget = await this.budgetRepository.find({
      where: {
        user_id: payload.userID,
        budget_month: exchangeDate.getMonth() + 1,
        budget_year: exchangeDate.getFullYear(),
        category_name: addTransactionDto.category_name as string
      }
    });
    if (checkBudget.length == 0) {
      return false;
    }

    if ((Number(checkBudget[0].amount_used) + parseFloat(addTransactionDto.amount_of_money.replace(/,/g, ''))) > checkBudget[0].amount_of_money) {
      isAdded = false;
    }

    const newTransaction = new Exchange();
    newTransaction.name = addTransactionDto.name.trim() as string;
    newTransaction.payment_method = addTransactionDto.payment_method as string;
    newTransaction.user_id = payload.userID;
    newTransaction.amount_of_money = parseFloat(addTransactionDto.amount_of_money.replace(/,/g, ''));
    newTransaction.category_name = addTransactionDto.category_name as string;
    newTransaction.exchange_date = exchangeDate;
    await this.exchangeRepository.save(newTransaction);

    await this.budgetRepository.update(
      { user_id: payload.userID, budget_month: exchangeDate.getMonth() + 1, budget_year: exchangeDate.getFullYear(), category_name: addTransactionDto.category_name as string },
      { amount_used: (checkBudget[0].amount_used + parseFloat(addTransactionDto.amount_of_money.replace(/,/g, ''))) }
    );

    var checkIncome = await this.incomeRepository.find({
      where: {
        user_id: payload.userID,
        income_month: exchangeDate.getMonth() + 1,
        income_year: exchangeDate.getFullYear(),
      }
    });

    await this.incomeRepository.update(
      { user_id: payload.userID, income_month: exchangeDate.getMonth() + 1, income_year: exchangeDate.getFullYear() },
      { total_money_used: (checkIncome[0].total_money_used + parseFloat(addTransactionDto.amount_of_money.replace(/,/g, ''))) }
    );

    return isAdded;
  }

  async SearchForTransactions(cookie: string, searchTransactionDto: SearchTransactionDto) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY });
    var lengthDaysArr;

    if (searchTransactionDto.timeTransaction == '7-day') {
      lengthDaysArr = 7;
    } else if (searchTransactionDto.timeTransaction == '1-day') {
      lengthDaysArr = 1;
    } else if (searchTransactionDto.timeTransaction == '30-day') {
      lengthDaysArr = 30;
    } else {
      lengthDaysArr = 0;
    }

    var today = (searchTransactionDto.transactionDate) ? new Date(searchTransactionDto.transactionDate) : new Date();
    const dayString = today.toISOString().split('T')[0];
    const [year, month, day] = dayString.split('-').map(Number);
    const daysArray = Array.from({ length: lengthDaysArr }, (v, i) => {
      return new Date(year, month - 1, day - i);
    });

    const searchData = [];
    if (lengthDaysArr) {
      for (let i = 0; i < lengthDaysArr; i++) {
        const whereClause: any = {
          user_id: payload.userID,
          exchange_date: daysArray[i]
        };
        if (searchTransactionDto.transactionName) {
          whereClause.name = searchTransactionDto.transactionName.trim();
        }
        if (searchTransactionDto.transactionCategory != 'all') {
          whereClause.category_name = searchTransactionDto.transactionCategory;
        }
        if (searchTransactionDto.transactionPaymentMethod != 'all') {
          whereClause.payment_method = searchTransactionDto.transactionPaymentMethod;
        }
        var tempDataSearch = await this.exchangeRepository.find({
          where: whereClause
        });
        searchData.push(...tempDataSearch);
      }
    } else {
      const whereClause: any = {
        user_id: payload.userID,
      };
      if (searchTransactionDto.transactionName) {
        whereClause.name = searchTransactionDto.transactionName.trim();
      }
      if (searchTransactionDto.transactionCategory != 'all') {
        whereClause.category_name = searchTransactionDto.transactionCategory;
      }
      if (searchTransactionDto.transactionPaymentMethod != 'all') {
        whereClause.payment_method = searchTransactionDto.transactionPaymentMethod;
      }
      var tempDataSearch = await this.exchangeRepository.find({
        where: whereClause
      });
      searchData.push(...tempDataSearch);
    }

    searchData.sort((a, b) => new Date(b.exchange_date).getTime() - new Date(a.exchange_date).getTime());

    const fileName = await this.exportToCsv(searchData, payload.userName);
    return {
      dataSearch: searchData,
      fileName
    };
  }

  async showBudgetPlan(cookie: string) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY });
    var dayBudget = new Date();
    var data = {} as any;
    var budgetExist = await this.budgetRepository.find({
      where: {
        user_id: payload.userID,
        budget_month: dayBudget.getMonth() + 1,
        budget_year: dayBudget.getFullYear()
      }
    });
    if (budgetExist.length != 0) {
      var incomeExist = await this.incomeRepository.find({
        where: {
          user_id: payload.userID,
          income_month: dayBudget.getMonth() + 1,
          income_year: dayBudget.getFullYear()
        }
      });
      data.totalMoney = incomeExist[0].total_money_income;
      for (let budget of budgetExist) {
        switch (budget.category_name) {
          case 'food':
            data.food = budget.amount_of_money;
            break;
          case 'education':
            data.education = budget.amount_of_money;
            break;
          case 'entertainment':
            data.entertainment = budget.amount_of_money;
            break;
          case 'clothes':
            data.clothes = budget.amount_of_money;
            break;
          case 'invest':
            data.invest = budget.amount_of_money;
            break;
          case 'other':
            data.other = budget.amount_of_money;
            break;
          default:
            break;
        }
      }
    }
    return data;
  }

  async postBudgetPlan(cookie: string, budgetPlanDto: BudgetPlanDto) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY });
    var isValidPlan = true;
    var totalMoenyLeft = parseFloat(budgetPlanDto.totalMoney.replace(/,/g, ''));
    if (budgetPlanDto.expenses && budgetPlanDto.saving) {
      totalMoenyLeft -= (parseFloat(budgetPlanDto.expenses.replace(/,/g, '')) + parseFloat(budgetPlanDto.saving.replace(/,/g, '')))
    }
    if (parseFloat(budgetPlanDto.food.replace(/,/g, '')) + parseFloat(budgetPlanDto.clothes.replace(/,/g, '')) + parseFloat(budgetPlanDto.education.replace(/,/g, '')) + parseFloat(budgetPlanDto.entertainment.replace(/,/g, '')) + parseFloat(budgetPlanDto.invest.replace(/,/g, '')) + parseFloat(budgetPlanDto.other.replace(/,/g, '')) > totalMoenyLeft) {
      isValidPlan = false
    } else {
      var dayBudget = new Date();
      var budgetExist = await this.budgetRepository.find({
        where: {
          user_id: payload.userID,
          budget_month: dayBudget.getMonth() + 1,
          budget_year: dayBudget.getFullYear()
        }
      });
      if (budgetExist.length != 0) {
        var temp_amount;
        for (let budget of budgetExist) {
          switch (budget.category_name) {
            case 'food':
              temp_amount = parseFloat(budgetPlanDto.food.replace(/,/g, ''));
              break;
            case 'education':
              temp_amount = parseFloat(budgetPlanDto.education.replace(/,/g, ''));
              break;
            case 'entertainment':
              temp_amount = parseFloat(budgetPlanDto.entertainment.replace(/,/g, ''));
              break;
            case 'clothes':
              temp_amount = parseFloat(budgetPlanDto.clothes.replace(/,/g, ''));
              break;
            case 'invest':
              temp_amount = parseFloat(budgetPlanDto.invest.replace(/,/g, ''));
              break;
            case 'other':
              temp_amount = parseFloat(budgetPlanDto.other.replace(/,/g, ''));
              break;
            default:
              break;
          }
          await this.budgetRepository.update(
            { user_id: payload.userID, budget_month: budget.budget_month, budget_year: budget.budget_year, category_name: budget.category_name },
            { amount_of_money: temp_amount }
          );
        }
        await this.incomeRepository.update(
          { user_id: payload.userID, income_month: dayBudget.getMonth() + 1, income_year: dayBudget.getFullYear() },
          { total_money_income: totalMoenyLeft }
        );
      } else {
        const newIncome = new Income();
        newIncome.user_id = payload.userID;
        newIncome.income_month = dayBudget.getMonth() + 1;
        newIncome.income_year = dayBudget.getFullYear();
        newIncome.total_money_income = totalMoenyLeft;
        newIncome.total_money_used = 0;
        await this.incomeRepository.save(newIncome);

        var arrCategories = ['food', 'entertainment', 'education', 'clothes', 'invest', 'other'];
        for (let cate of arrCategories) {
          var temp_amount;
          switch (cate) {
            case 'food':
              temp_amount = parseFloat(budgetPlanDto.food.replace(/,/g, ''));
              break;
            case 'education':
              temp_amount = parseFloat(budgetPlanDto.education.replace(/,/g, ''));
              break;
            case 'entertainment':
              temp_amount = parseFloat(budgetPlanDto.entertainment.replace(/,/g, ''));
              break;
            case 'clothes':
              temp_amount = parseFloat(budgetPlanDto.clothes.replace(/,/g, ''));
              break;
            case 'invest':
              temp_amount = parseFloat(budgetPlanDto.invest.replace(/,/g, ''));
              break;
            case 'other':
              temp_amount = parseFloat(budgetPlanDto.other.replace(/,/g, ''));
              break;
            default:
              break;
          }
          let newBudget = new Budget();
          newBudget.user_id = payload.userID;
          newBudget.budget_month = dayBudget.getMonth() + 1;
          newBudget.budget_year = dayBudget.getFullYear();
          newBudget.amount_of_money = temp_amount;
          newBudget.category_name = cate;
          newBudget.amount_used = 0;
          await this.budgetRepository.save(newBudget);
        }
      }
    }

    return isValidPlan;
  }

  async postAutoPlanning(cookie: string, autoPlanningDto: AutoPlanningDto) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY });
    var data = {} as any, isNotValid = false, moneyLeftAfterDvide = 0;

    if (parseFloat(autoPlanningDto.expenses.replace(/,/g, '')) + parseFloat(autoPlanningDto.saving.replace(/,/g, '')) >= parseFloat(autoPlanningDto.totalMoney.replace(/,/g, ''))) {
      isNotValid = true;
    } else {
      var moneyLeft = parseFloat(autoPlanningDto.totalMoney.replace(/,/g, '')) - parseFloat(autoPlanningDto.expenses.replace(/,/g, '')) - parseFloat(autoPlanningDto.saving.replace(/,/g, ''));
      data.totalMoney = autoPlanningDto.totalMoney;
      data.saving = autoPlanningDto.saving;
      data.expenses = autoPlanningDto.expenses;

      var selectedCategories = [];
      for (const [key, value] of Object.entries(autoPlanningDto)) {
        if (value === 'on' && key !== 'totalMoney' && key !== 'expenses' && key !== 'saving') {
          selectedCategories.push(key);
        }
      }

      var checkProfession = await this.usersRepository.find({
        where: {
          id: payload.userID,
        }
      });
      switch (checkProfession[0].profession) {
        case 'Student':
          if (selectedCategories.length == 5) {
            data.food = moneyLeft * this.budgetAnalyze.Student.food;
            data.education = moneyLeft * this.budgetAnalyze.Student.education;
            data.entertainment = moneyLeft * this.budgetAnalyze.Student.entertainment;
            data.clothes = moneyLeft * this.budgetAnalyze.Student.clothes;
            data.invest = moneyLeft * this.budgetAnalyze.Student.invest;
            data.other = moneyLeft * this.budgetAnalyze.Student.other;
          } else {
            for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
              switch (cate) {
                case 'food':
                  if (selectedCategories.includes('food')) {
                    data.food = moneyLeft * this.budgetAnalyze.Student.food;
                  } else {
                    data.food = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Student.food;
                  }
                  break;
                case 'education':
                  if (selectedCategories.includes('education')) {
                    data.education = moneyLeft * this.budgetAnalyze.Student.education;
                  } else {
                    data.education = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Student.education;
                  }
                  break;
                case 'entertainment':
                  if (selectedCategories.includes('entertainment')) {
                    data.entertainment = moneyLeft * this.budgetAnalyze.Student.entertainment;
                  } else {
                    data.entertainment = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Student.entertainment;
                  }
                  break;
                case 'clothes':
                  if (selectedCategories.includes('clothes')) {
                    data.clothes = moneyLeft * this.budgetAnalyze.Student.clothes;
                  } else {
                    data.clothes = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Student.clothes;
                  }
                  break;
                case 'invest':
                  if (selectedCategories.includes('invest')) {
                    data.invest = moneyLeft * this.budgetAnalyze.Student.invest;
                  } else {
                    data.invest = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Student.invest;
                  }
                  break;
                case 'other':
                  if (selectedCategories.includes('other')) {
                    data.other = moneyLeft * this.budgetAnalyze.Student.other;
                  } else {
                    data.other = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Student.other;
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        case 'IT':
          if (selectedCategories.length == 5) {
            data.food = moneyLeft * this.budgetAnalyze.IT.food;
            data.education = moneyLeft * this.budgetAnalyze.IT.education;
            data.entertainment = moneyLeft * this.budgetAnalyze.IT.entertainment;
            data.clothes = moneyLeft * this.budgetAnalyze.IT.clothes;
            data.invest = moneyLeft * this.budgetAnalyze.IT.invest;
            data.other = moneyLeft * this.budgetAnalyze.IT.other;
          } else {
            for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
              switch (cate) {
                case 'food':
                  if (selectedCategories.includes('food')) {
                    data.food = moneyLeft * this.budgetAnalyze.IT.food;
                  } else {
                    data.food = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.IT.food;
                  }
                  break;
                case 'education':
                  if (selectedCategories.includes('education')) {
                    data.education = moneyLeft * this.budgetAnalyze.IT.education;
                  } else {
                    data.education = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.IT.education;
                  }
                  break;
                case 'entertainment':
                  if (selectedCategories.includes('entertainment')) {
                    data.entertainment = moneyLeft * this.budgetAnalyze.IT.entertainment;
                  } else {
                    data.entertainment = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.IT.entertainment;
                  }
                  break;
                case 'clothes':
                  if (selectedCategories.includes('clothes')) {
                    data.clothes = moneyLeft * this.budgetAnalyze.IT.clothes;
                  } else {
                    data.clothes = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.IT.clothes;
                  }
                  break;
                case 'invest':
                  if (selectedCategories.includes('invest')) {
                    data.invest = moneyLeft * this.budgetAnalyze.IT.invest;
                  } else {
                    data.invest = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.IT.invest;
                  }
                  break;
                case 'other':
                  if (selectedCategories.includes('other')) {
                    data.other = moneyLeft * this.budgetAnalyze.IT.other;
                  } else {
                    data.other = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.IT.other;
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        case 'Doctor':
          if (selectedCategories.length == 5) {
            data.food = moneyLeft * this.budgetAnalyze.Doctor.food;
            data.education = moneyLeft * this.budgetAnalyze.Doctor.education;
            data.entertainment = moneyLeft * this.budgetAnalyze.Doctor.entertainment;
            data.clothes = moneyLeft * this.budgetAnalyze.Doctor.clothes;
            data.invest = moneyLeft * this.budgetAnalyze.Doctor.invest;
            data.other = moneyLeft * this.budgetAnalyze.Doctor.other;
          } else {
            for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
              switch (cate) {
                case 'food':
                  if (selectedCategories.includes('food')) {
                    data.food = moneyLeft * this.budgetAnalyze.Doctor.food;
                  } else {
                    data.food = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Doctor.food;
                  }
                  break;
                case 'education':
                  if (selectedCategories.includes('education')) {
                    data.education = moneyLeft * this.budgetAnalyze.Doctor.education;
                  } else {
                    data.education = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Doctor.education;
                  }
                  break;
                case 'entertainment':
                  if (selectedCategories.includes('entertainment')) {
                    data.entertainment = moneyLeft * this.budgetAnalyze.Doctor.entertainment;
                  } else {
                    data.entertainment = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Doctor.entertainment;
                  }
                  break;
                case 'clothes':
                  if (selectedCategories.includes('clothes')) {
                    data.clothes = moneyLeft * this.budgetAnalyze.Doctor.clothes;
                  } else {
                    data.clothes = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Doctor.clothes;
                  }
                  break;
                case 'invest':
                  if (selectedCategories.includes('invest')) {
                    data.invest = moneyLeft * this.budgetAnalyze.Doctor.invest;
                  } else {
                    data.invest = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Doctor.invest;
                  }
                  break;
                case 'other':
                  if (selectedCategories.includes('other')) {
                    data.other = moneyLeft * this.budgetAnalyze.Doctor.other;
                  } else {
                    data.other = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Doctor.other;
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        case 'Teacher':
          if (selectedCategories.length == 5) {
            data.food = moneyLeft * this.budgetAnalyze.Teacher.food;
            data.education = moneyLeft * this.budgetAnalyze.Teacher.education;
            data.entertainment = moneyLeft * this.budgetAnalyze.Teacher.entertainment;
            data.clothes = moneyLeft * this.budgetAnalyze.Teacher.clothes;
            data.invest = moneyLeft * this.budgetAnalyze.Teacher.invest;
            data.other = moneyLeft * this.budgetAnalyze.Teacher.other;
          } else {
            for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
              switch (cate) {
                case 'food':
                  if (selectedCategories.includes('food')) {
                    data.food = moneyLeft * this.budgetAnalyze.Teacher.food;
                  } else {
                    data.food = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Teacher.food;
                  }
                  break;
                case 'education':
                  if (selectedCategories.includes('education')) {
                    data.education = moneyLeft * this.budgetAnalyze.Teacher.education;
                  } else {
                    data.education = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Teacher.education;
                  }
                  break;
                case 'entertainment':
                  if (selectedCategories.includes('entertainment')) {
                    data.entertainment = moneyLeft * this.budgetAnalyze.Teacher.entertainment;
                  } else {
                    data.entertainment = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Teacher.entertainment;
                  }
                  break;
                case 'clothes':
                  if (selectedCategories.includes('clothes')) {
                    data.clothes = moneyLeft * this.budgetAnalyze.Teacher.clothes;
                  } else {
                    data.clothes = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Teacher.clothes;
                  }
                  break;
                case 'invest':
                  if (selectedCategories.includes('invest')) {
                    data.invest = moneyLeft * this.budgetAnalyze.Teacher.invest;
                  } else {
                    data.invest = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Teacher.invest;
                  }
                  break;
                case 'other':
                  if (selectedCategories.includes('other')) {
                    data.other = moneyLeft * this.budgetAnalyze.Teacher.other;
                  } else {
                    data.other = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Teacher.other;
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        case 'Worker':
          if (selectedCategories.length == 5) {
            data.food = moneyLeft * this.budgetAnalyze.Worker.food;
            data.education = moneyLeft * this.budgetAnalyze.Worker.education;
            data.entertainment = moneyLeft * this.budgetAnalyze.Worker.entertainment;
            data.clothes = moneyLeft * this.budgetAnalyze.Worker.clothes;
            data.invest = moneyLeft * this.budgetAnalyze.Worker.invest;
            data.other = moneyLeft * this.budgetAnalyze.Worker.other;
          } else {
            for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
              switch (cate) {
                case 'food':
                  if (selectedCategories.includes('food')) {
                    data.food = moneyLeft * this.budgetAnalyze.Worker.food;
                  } else {
                    data.food = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Worker.food;
                  }
                  break;
                case 'education':
                  if (selectedCategories.includes('education')) {
                    data.education = moneyLeft * this.budgetAnalyze.Worker.education;
                  } else {
                    data.education = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Worker.education;
                  }
                  break;
                case 'entertainment':
                  if (selectedCategories.includes('entertainment')) {
                    data.entertainment = moneyLeft * this.budgetAnalyze.Worker.entertainment;
                  } else {
                    data.entertainment = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Worker.entertainment;
                  }
                  break;
                case 'clothes':
                  if (selectedCategories.includes('clothes')) {
                    data.clothes = moneyLeft * this.budgetAnalyze.Worker.clothes;
                  } else {
                    data.clothes = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Worker.clothes;
                  }
                  break;
                case 'invest':
                  if (selectedCategories.includes('invest')) {
                    data.invest = moneyLeft * this.budgetAnalyze.Worker.invest;
                  } else {
                    data.invest = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Worker.invest;
                  }
                  break;
                case 'other':
                  if (selectedCategories.includes('other')) {
                    data.other = moneyLeft * this.budgetAnalyze.Worker.other;
                  } else {
                    data.other = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Worker.other;
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        case 'Other':
          if (selectedCategories.length == 5) {
            data.food = moneyLeft * this.budgetAnalyze.Other.food;
            data.education = moneyLeft * this.budgetAnalyze.Other.education;
            data.entertainment = moneyLeft * this.budgetAnalyze.Other.entertainment;
            data.clothes = moneyLeft * this.budgetAnalyze.Other.clothes;
            data.invest = moneyLeft * this.budgetAnalyze.Other.invest;
            data.other = moneyLeft * this.budgetAnalyze.Other.other;
          } else {
            for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
              switch (cate) {
                case 'food':
                  if (selectedCategories.includes('food')) {
                    data.food = moneyLeft * this.budgetAnalyze.Other.food;
                  } else {
                    data.food = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Other.food;
                  }
                  break;
                case 'education':
                  if (selectedCategories.includes('education')) {
                    data.education = moneyLeft * this.budgetAnalyze.Other.education;
                  } else {
                    data.education = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Other.education;
                  }
                  break;
                case 'entertainment':
                  if (selectedCategories.includes('entertainment')) {
                    data.entertainment = moneyLeft * this.budgetAnalyze.Other.entertainment;
                  } else {
                    data.entertainment = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Other.entertainment;
                  }
                  break;
                case 'clothes':
                  if (selectedCategories.includes('clothes')) {
                    data.clothes = moneyLeft * this.budgetAnalyze.Other.clothes;
                  } else {
                    data.clothes = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Other.clothes;
                  }
                  break;
                case 'invest':
                  if (selectedCategories.includes('invest')) {
                    data.invest = moneyLeft * this.budgetAnalyze.Other.invest;
                  } else {
                    data.invest = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Other.invest;
                  }
                  break;
                case 'other':
                  if (selectedCategories.includes('other')) {
                    data.other = moneyLeft * this.budgetAnalyze.Other.other;
                  } else {
                    data.other = 0;
                    moneyLeftAfterDvide += moneyLeft * this.budgetAnalyze.Other.other;
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        default:
          break;
      }
    }

    for (let cate of ['food', 'education', 'entertainment', 'clothes', 'invest', 'other']) {
      if (selectedCategories.includes(cate)) {
        if (cate == 'food') { 
          data.food += Math.floor(moneyLeftAfterDvide / (selectedCategories.length));
        } else if (cate == 'education') {
          data.education += Math.floor(moneyLeftAfterDvide / (selectedCategories.length));
        } else if (cate == 'entertainment') {
          data.entertainment += Math.floor(moneyLeftAfterDvide / (selectedCategories.length));
        } else if (cate == 'clothes') {
          data.clothes += Math.floor(moneyLeftAfterDvide / (selectedCategories.length));
        } else if (cate == 'invest') {
          data.invest += Math.floor(moneyLeftAfterDvide / (selectedCategories.length));
        } else {
          data.other += Math.floor(moneyLeftAfterDvide / (selectedCategories.length));
        }
      }
    }

    return { data, isNotValid }
  }

  async showInformationReport(cookie: string, inforReportDto?: InforReportDto) {
    const payload = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET_KEY });
    var pieChart = {} as any, progressChart = {} as any, dynamicChart = {} as any, today, moneyLeft = 0;

    if (inforReportDto) {
      today = new Date(inforReportDto.timeStatistic);
    } else {
      today = new Date();
    }

    var incomeRecord = await this.incomeRepository.find({
      where: {
        user_id: payload.userID,
        income_month: today.getMonth() + 1,
        income_year: today.getFullYear(),
      }
    });
    
    if (incomeRecord.length == 0) {
      moneyLeft = 0;
    } else {
      moneyLeft = incomeRecord[0].total_money_income - incomeRecord[0].total_money_used;
    }

    var budgetRecord = await this.budgetRepository.find({
      where: {
        user_id: payload.userID,
        budget_month: today.getMonth() + 1,
        budget_year: today.getFullYear()
      }
    });
    if (budgetRecord.length == 0) {
      pieChart.food = 0;
      dynamicChart.thisMonthFood = 0;
      progressChart.food = 0;
      pieChart.education = 0;
      dynamicChart.thisMonthEducation = 0;
      progressChart.education = 0;
      pieChart.entertainment = 0;
      dynamicChart.thisMonthEntertainment = 0;
      progressChart.entertainment = 0;
      pieChart.clothes = 0;
      dynamicChart.thisMonthClothes = 0;
      progressChart.clothes = 0;
      pieChart.invest = 0;
      dynamicChart.thisMonthInvest = 0;
      progressChart.invest = 0;
      pieChart.other = 0;
      dynamicChart.thisMonthOther = 0;
      progressChart.other = 0;
    } else {
      for (let cate of budgetRecord) {
        switch (cate.category_name) {
          case 'food':
            pieChart.food = cate.amount_used;
            dynamicChart.thisMonthFood = cate.amount_used;
            if (cate.amount_of_money == 0) {
              progressChart.food = cate.amount_used;
            } else {
              progressChart.food = Math.floor((cate.amount_used / cate.amount_of_money) * 100);
            }
            break;
          case 'education':
            pieChart.education = cate.amount_used;
            dynamicChart.thisMonthEducation = cate.amount_used;
            if (cate.amount_of_money == 0) {
              progressChart.education = cate.amount_used;
            } else {
              progressChart.education = Math.floor((cate.amount_used / cate.amount_of_money) * 100);
            }
            break;
          case 'entertainment':
            pieChart.entertainment = cate.amount_used;
            dynamicChart.thisMonthEntertainment = cate.amount_used;
            if (cate.amount_of_money == 0) {
              progressChart.entertainment = cate.amount_used;
            } else {
              progressChart.entertainment = Math.floor((cate.amount_used / cate.amount_of_money) * 100);
            }
            break;
          case 'clothes':
            pieChart.clothes = cate.amount_used;
            dynamicChart.thisMonthClothes = cate.amount_used;
            if (cate.amount_of_money == 0) {
              progressChart.clothes = cate.amount_used;
            } else {
              progressChart.clothes = Math.floor((cate.amount_used / cate.amount_of_money) * 100);
            }
            break;
          case 'invest':
            pieChart.invest = cate.amount_used;
            dynamicChart.thisMonthInvest = cate.amount_used;
            if (cate.amount_of_money == 0) {
              progressChart.invest = cate.amount_used;
            } else {
              progressChart.invest = Math.floor((cate.amount_used / cate.amount_of_money) * 100);
            }
            break;
          case 'other':
            pieChart.other = cate.amount_used;
            dynamicChart.thisMonthOther = cate.amount_used;
            if (cate.amount_of_money == 0) {
              progressChart.other = cate.amount_used;
            } else {
              progressChart.other = Math.floor((cate.amount_used / cate.amount_of_money) * 100);
            }
            break;
          default:
            break;
        }
      }
    }

    var budgetPreviousRecord = await this.budgetRepository.find({
      where: {
        user_id: payload.userID,
        budget_month: today.getMonth(),
        budget_year: today.getFullYear()
      }
    });
    if (budgetPreviousRecord.length == 0) {
      dynamicChart.previousMonthFood = 0;
      dynamicChart.previousMonthEducation = 0;
      dynamicChart.previousMonthEntertainment = 0;
      dynamicChart.previousMonthClothes = 0;
      dynamicChart.previousMonthInvest = 0;
      dynamicChart.previousMonthOther = 0;
    } else {
      for (let cate of budgetPreviousRecord) {
        switch (cate.category_name) {
          case 'food':
            dynamicChart.previousMonthFood = cate.amount_used;
            break;
          case 'education':
            dynamicChart.previousMonthEducation = cate.amount_used;
            break;
          case 'entertainment':
            dynamicChart.previousMonthEntertainment = cate.amount_used;
            break;
          case 'clothes':
            dynamicChart.previousMonthClothes = cate.amount_used;
            break;
          case 'invest':
            dynamicChart.previousMonthInvest = cate.amount_used;
            break;
          case 'other':
            dynamicChart.previousMonthOther = cate.amount_used;
            break;
          default:
            break;
        }
      }
    }

    return {
      moneyLeft,
      pieChart,
      progressChart,
      dynamicChart,
      monthInfor: today.getMonth() + 1,
      yearInfor: today.getFullYear()
    }
  }
}
