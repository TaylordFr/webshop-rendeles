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
      bankkartya:'4321-4567',
      lejarati_datum:'10/27',
      kupon:'444',
      biztonsagi_kod: '999'
    },
    {
      nev: 'Majka',
      szamlazasi_cim: 'hun',
      szallitasi_cim: 'hun',
      bankkartya: '1234-5555',
      lejarati_datum: '12/30',
      kupon: '555',
      biztonsagi_kod: '111'
    }
  ];

  

  @Get('rendeles')
  @Render('rendelesform')
  ujAdat(){
    return{
      errors: [],
      data: []
    }
  }

  @Get('/rendelessuccess')
  @Render('success')
  getsuccess(){
      return {
        rendelesek: this.#rendelesek.length
      }
  }


 @Post('rendeles')
 insertData(
  @Body() orderData: newRendeles,
    @Res() response: Response
 ){
    const errors: string[] = [];

    if(!orderData.nev || !orderData.szamlazasi_cim || !orderData.szallitasi_cim || !orderData.bankkartya || !orderData.lejarati_datum || !orderData.biztonsagi_kod){
      errors.push('Minden mezőt kötelező megadni!');
    }
    if(!/\d{2}\/d{2}$/.test(orderData.lejarati_datum) || this.Isexpired(orderData.lejarati_datum)){
      errors.push('Helytelen a dátum!')
    }
    if(!/^\d{2}-\d{4}$/.test(orderData.kupon)){
      errors.push('A kuponkód nem megfelelő formátumú!')
    }
    if(!/\d{4}-\d{4}$/.test(orderData.bankkartya)){
      errors.push('A bankkártyaszám nem megfelelő formátumú!')
    }
    if(! /^\d{3}$/.test(orderData.biztonsagi_kod)){
      errors.push('A biztonsági kód nem megfelelő formátumú!')
    }

    const newRendeles = {
      nev: orderData.nev,
      szamlazasi_cim: orderData.szamlazasi_cim,
      szallitasi_cim: orderData.szallitasi_cim,
      bankkartya: orderData.bankkartya,
      lejarati_datum: orderData.lejarati_datum,
      kupon: orderData.kupon,
      biztonsagi_kod: orderData.biztonsagi_kod
    }

    if(errors.length > 0){
      response.render('rendelesform', {
        errors,
        data: orderData
      })
      return;
    }

    this.#rendelesek.push(newRendeles)
    response.redirect(303, '/rendelessuccess');

  }
  

    private Isexpired(lejarati_datum: string): boolean {
        const  [month, year] = lejarati_datum.split('/').map(num => parseInt(num));
        const now = new Date();
        const expiry = new Date(2000 + year, month -1)
        return expiry < now;
    }
}
