import { Form, formevent, EventType, FormEvent, datasource } from "futureforms";
import content from './Test1.html';
import { TestDS as DataSource } from '../../datasources/TestDS';

@datasource("test",DataSource)

export class Test1 extends Form {

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


