import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

/*tslint:disable max-line-length*/
const urlRexp: RegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export class AddPeerDTO {
    @ApiModelProperty({ description: 'Valid websocket server url'})
    @IsString()
    @Matches(urlRexp)
    address: string;
}