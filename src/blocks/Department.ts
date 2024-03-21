import { Department as DataSource } from '../datasources/Department';
import { Block, EventType, Form, FormEvent, formevent } from "futureforms";


export class Department extends Block
{
	constructor(form:Form, name:string)
	{
		super(form,name);
		this.datasource = new DataSource();
	}


	/** Trigger template */
	@formevent({type: EventType.WhenValidateField})
	public async validateField(event:FormEvent) : Promise<boolean>
	{
		return(true);
	}
}
