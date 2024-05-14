import { Body, Controller, Get, Param, Post, Redirect, Render, Req, Res, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { FunctionsService } from './functions.service';
import { AddTransactionDto } from 'src/dto/addTransaction.dto';
import { SearchTransactionDto } from 'src/dto/searchTransaction.dto';
import { BudgetPlanDto } from 'src/dto/budgetPlan.dto';
import { AutoPlanningDto } from 'src/dto/autoPlanning.dto';
import { InforReportDto } from 'src/dto/inforReportDto.dto';

@Controller('functions')
export class FunctionsController {
  constructor(
    private readonly functionsService: FunctionsService
  ) { }

  @Get('add-transaction')
  @Render('functions/add-transaction-page')
  async showAddTransactions(@Req() req: Request) {
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token'])
    }
  }

  @Post('add-transaction')
  @Render('functions/add-transaction-page')
  async postAddTransactions(
    @Req() req: Request,
    @Body() addTransactionDto: AddTransactionDto
  ) {
    const isAdded = await this.functionsService.addTransaction(req.cookies['token'], addTransactionDto);
    if(isAdded) {
      return {
        showHeader: true,
        showFooter: false,
        userName: await this.functionsService.getUserName(req.cookies['token']),
        isAdded: true
      }
    } else {
      return {
        showHeader: true,
        showFooter: false,
        userName: await this.functionsService.getUserName(req.cookies['token']),
        notAdded: true
      }
    }
  }

  @Get('search-for-transactions')
  @Render('functions/search-for-transactions-page')
  async showSearchForTransactions(@Req() req: Request) {
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token'])
    }
  }

  @Get('download-report/:fileName')
  async downloadReport(
    @Param('fileName') fileName: string, 
    @Res() res: Response
  ) {
    res.download(`exportSearching/${fileName}.csv`, (err) => {
      if (err) {
        return res.status(500).send('Download failed');
      }

      // Xóa tệp sau khi tải xuống thành công
      this.functionsService.deleteFile(`exportSearching/${fileName}.csv`);
    });
  }

  @Post('search-for-transactions')
  @Render('functions/search-for-transactions-page')
  async SearchForTransactions(
    @Req() req: Request,
    @Body() searchTransactionDto: SearchTransactionDto
  ) {
    const {dataSearch, fileName} = await this.functionsService.SearchForTransactions(req.cookies['token'], searchTransactionDto);
    return {
      dataSearch,
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token']),
      fileName
    }
  }

  @Get('budget-plan')
  @Render('functions/budget-plan-page')
  async showBudgetPlan(@Req() req: Request) {
    const data = await this.functionsService.showBudgetPlan(req.cookies['token']);
    if (data) {
      return {
        showHeader: true,
        showFooter: false,
        userName: await this.functionsService.getUserName(req.cookies['token']),
        data: data
      }
    }
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token'])
    }
  }

  @Post('budget-plan')
  @Render('functions/budget-plan-page')
  async postBudgetPlan(
    @Req() req: Request, 
    @Res() res: Response,
    @Body(new ValidationPipe()) budgetPlanDto: BudgetPlanDto
  ) {
    const isValidPlan = await this.functionsService.postBudgetPlan(req.cookies['token'], budgetPlanDto);
    const data = await this.functionsService.showBudgetPlan(req.cookies['token']);
    if (isValidPlan) {
      return {
        showHeader: true,
        showFooter: false,
        userName: await this.functionsService.getUserName(req.cookies['token']),
        isValid: true,
        data
      }
    } else {
      return {
        showHeader: true,
        showFooter: false,
        userName: await this.functionsService.getUserName(req.cookies['token']),
        isNotValid: true
      }
    }
  }

  @Get('auto-planning')
  @Render('functions/auto-planning')
  async showAutoPlanning(@Req() req: Request) {
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token'])
    }
  }

  @Post('auto-planning')
  @Render('functions/result-auto-planning')
  async postAutoPlanning(
    @Req() req: Request,
    @Body(new ValidationPipe()) autoPlanningDto: AutoPlanningDto
  ) {
    const {data, isNotValid} = await this.functionsService.postAutoPlanning(req.cookies['token'], autoPlanningDto);
    if (isNotValid) {
      return {
        showHeader: true,
        showFooter: false,
        userName: await this.functionsService.getUserName(req.cookies['token']),
        isNotValid
      }
    }
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token']),
      data
    }
  }

  @Get('information-report')
  @Render('functions/information-report-page')
  async showInformationReport(
    @Req() req: Request
  ) {
    const {moneyLeft, pieChart, progressChart, dynamicChart, monthInfor, yearInfor} = await this.functionsService.showInformationReport(req.cookies['token']);
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token']),
      moneyLeft: moneyLeft.toLocaleString(),
      pieChart,
      progressChart,
      dynamicChart,
      monthInfor,
      yearInfor
    }
  }

  @Post('information-report')
  @Render('functions/information-report-page')
  async postInformationReport(
    @Req() req: Request,
    @Body(new ValidationPipe()) inforReportDto: InforReportDto
  ) {
    const {moneyLeft, pieChart, progressChart, dynamicChart, monthInfor, yearInfor} = await this.functionsService.showInformationReport(req.cookies['token'], inforReportDto);
    return {
      showHeader: true,
      showFooter: false,
      userName: await this.functionsService.getUserName(req.cookies['token']),
      moneyLeft: moneyLeft.toLocaleString(),
      pieChart,
      progressChart,
      dynamicChart,
      monthInfor,
      yearInfor
    }
  }
}
