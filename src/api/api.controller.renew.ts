import { Controller, Get, Query } from '@nestjs/common';
import { execSync } from 'child_process';

@Controller('api')
export class ApiRenewController {

  @Get('renewws')
  async renewWS(
    @Query('num') num: string,
    @Query('quota') quota: string,
    @Query('limitip') limitip: string,
    @Query('exp') exp: string,
  ) {
    try {
      const cmd = `printf "%s\n" "${num}" "${exp}" "${quota}" "${limitip}" | renew-ws`;
      const result = execSync(cmd).toString().trim();
      return `Renewed with parameters:\nNumber: ${num}\nQuota: ${quota}\nLimit IP: ${limitip}\nExpiry: ${exp}\n\nResult:\n${result}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
  @Get('renewvl')
  async renewVl(
    @Query('num') num: string,
    @Query('quota') quota: string,
    @Query('limitip') limitip: string,
    @Query('exp') exp: string,
  ) {
    try {
      const cmd = `printf "%s\n" "${num}" "${exp}" "${quota}" "${limitip}" | renew-ws`;
      const result = execSync(cmd).toString().trim();
      return `Renewed with parameters:\nNumber: ${num}\nQuota: ${quota}\nLimit IP: ${limitip}\nExpiry: ${exp}\n\nResult:\n${result}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
}
