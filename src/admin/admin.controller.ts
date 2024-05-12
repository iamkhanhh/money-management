import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Redirect, Render, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { Response } from 'express';
import { StatisticCategories } from './admin.service';
import { EditUserDto } from 'src/dto/editUser.dto';
import { SearchUserDto } from 'src/dto/searchUser.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService
  ) {}

  @Get('dashboard')
  @Render('admin/dashboard')
  async showAdminDashboard(@Req() req: Request) {
    const {
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
    } = await this.adminService.dashboard();
    return {
      showHeader: true,
      showFooter: false,
      userName: req.cookies['token']? await this.adminService.getUserName(req.cookies['token']): 'user',
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

  @Get('list-users')
  @Render('admin/managingUsers')
  async listOfUsers(
    @Req() req: Request,
    @Query('mode') mode: string
  ) {
    const data = await this.adminService.listOfUsers(mode, false);
    return {
      showHeader: true,
      userName: await this.adminService.getUserName(req.cookies['token']),
      data
    }
  }

  @Get('list-user-trash')
  @Render('admin/trashUsers')
  async showTrashUsers(
    @Req() req: Request,
    @Query('mode') mode: string
  ) {
    const data = await this.adminService.listOfUsers(mode, true);
    return {
      showHeader: true,
      userName: await this.adminService.getUserName(req.cookies['token']),
      data
    }
  }

  @Patch('delete-user/:id')
  @Redirect('/admin/list-users?mode=all')
  async deleteUserSoft(
    @Req() req: Request,
    @Param('id') id: number
  ) {
    return await this.adminService.deleteUserSoft(id);
  }

  @Patch('restore-user/:id')
  @Redirect('/admin/list-user-trash?mode=all')
  async restoreUser(
    @Req() req: Request,
    @Param('id') id: number
  ) {
    return await this.adminService.restoreUser(id);
  }

  @Patch('resetPassword-user/:id')
  @Redirect('/admin/list-users?mode=all')
  async resetPassword(
    @Req() req: Request,
    @Param('id') id: number
  ) {
    return await this.adminService.resetPassword(id);
  }

  @Delete('delete-user-hard/:id')
  @Redirect('/admin/list-user-trash?mode=all')
  async deleteUserHard(
    @Req() req: Request,
    @Param('id') id: number
  ) {
    return await this.adminService.deleteUserHard(id);
  }

  @Patch('add-admin/:id')
  @Redirect()
  async grantAdmin(
    @Req() req: Request,
    @Param('id') id: number
  ) {
    await this.adminService.grantAdmin(id);
    return { url: `/admin/edit-user/${id}` };
  }

  @Get('edit-user/:id')
  @Render('admin/editUser')
  async getDataUserEdit(
    @Req() req: Request,
    @Param('id') id: number
  ) {
    var isMale  = false, isFemale  = false, isOther  = false;
    const data = await this.adminService.getDataUserEdit(id);
    if (data.gender == 'male') {
      isMale = true;
    } else if (data.gender == 'female') {
      isFemale = true;
    } else {
      isOther = true;
    }
    return {
      showHeader: true,
      userName: await this.adminService.getUserName(req.cookies['token']),
      data,
      isMale,
      isFemale,
      isOther
    }
  }

  @Put('/edit-user/:id')
  @Redirect()
  async editUser(
    @Param('id') id: number,
    @Body() editUserDto: EditUserDto
  ) {
    await this.adminService.editUser(id, editUserDto);
    return {url: `/admin/edit-user/${id}` }
  }

  @Get('database')
  @Render('admin/database')
  async showDatabase(
    @Req() req: Request,
  ) {
    const {budgetTable, exchangeTable, incomeTable, usersTable} = await this.adminService.showDatabase();
    return {
      showHeader: true,
      userName: req.cookies['token']? await this.adminService.getUserName(req.cookies['token']): 'user',
      budgetTable, 
      exchangeTable, 
      incomeTable, 
      usersTable
    }
  }

  @Get('search-user')
  @Render('admin/searchUser')
  async searchUsers(
    @Req() req: Request,
  ) {
    return {
      showHeader: true,
      userName: await this.adminService.getUserName(req.cookies['token'])
    }
  }

  @Post('search-user')
  @Render('admin/searchUser')
  async searchUsersPost(
    @Req() req: Request,
    @Body() searchUserDto: SearchUserDto
  ) {
    const data = await this.adminService.searchUsers(searchUserDto);
    return { 
      showHeader: true,
      userName: await this.adminService.getUserName(req.cookies['token']),
      data
    }
  }

  @Get('contact')
  @Render('admin/contact')
  async showContact(
    @Req() req: Request,
  ) {
    const {yourName, yourEmail} = await this.adminService.getContact(req.cookies['token']);
    return {
      showHeader: true,
      userName: await this.adminService.getUserName(req.cookies['token']),
      yourEmail,
      yourName
    }
  }
}
