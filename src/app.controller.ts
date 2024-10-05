import { Controller, Get, Render, Body, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { newRendeles } from './newData.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  #rendelesek = [
    {
      nev: 'Curtis',
      szamlazasi_cim:'hun',
      szallitasi_cim:'hun',
      kupon:'444',
      bankkartya_szam:'4321-4567',
      lejarati_datum:'10/27',
      biztonsagi_kod: '999'
    }
  ];

  

  @Get('/insertdata')
  @Render('ujAdat')
  ujAdat(){
    return{
      errors: [],
      data: []
    }
  }


  @Get('/termekek')
  @Render('termekek')
  getTermekek() {

 }

 @Post('/insertdata')
 insertData(
  @Body() orderData: newRendeles,
    @Res() response: Response
 ){
    const errors: string[] = [];


    if(!orderData.nev || !orderData.szamlazasi_cim || !orderData.szallitasi_cim || !orderData.bankkartya || !orderData.lejarati_datum || !orderData.biztonsagi_kod){
      errors.push('Minden mezőt kötelező megadni!');
    }
    if(! /^\d{3}$/.test(orderData.biztonsagi_kod)){
      errors.push('A biztonsági kód nem megfelelő formátumú!')
    }

    const newRendeles = {
      nev: orderData.nev,
      szamlazasi_cim: orderData.szamlazasi_cim,
      szallitasi_cim:orderData.szallitasi_cim,
      kupon:orderData.kupon,
      bankartya_szam:orderData.bankkartya,
      lejarati_datum:orderData.lejarati_datum,
      biztonsagi_kod:orderData.biztonsagi_kod
    }

    if(errors.length < 0){
      response.render('ujAdat', {
        errors,
        data: orderData
      })
      return;
    }
  }
}
