
import content from './Template.html';

import { Template as DataSource } from '../../datasources/Template';
import { Form, EventType, FormEvent,datasource, formevent } from 'futureforms';



@datasource("jobs",DataSource)

export class Template extends Form {

    constructor(){

        super(content)

    };
/** Trigger template */
@formevent({type: EventType.PostViewInit})
public async validateField(event:FormEvent) : Promise<boolean>
{
    console.log(this.canvas)
   this.blocks.forEach((block) => console.log(block));

   return true
}
}
