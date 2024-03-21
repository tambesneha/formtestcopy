
import { Filter, Filters, ListOfValues } from "futureforms";
import { Department as DataSource } from '../datasources/Department';


export class Department extends ListOfValues
{
	public title:string = "Department";

	constructor()
	{
		super();

		this.datasource = new DataSource();
		this.filter = Filters.Equals("col0")

		this.sourcefields = ["col1","col2"];
		this.targetfields = ["field1","field2"];
		this.displayfields = ["col0","col3","col4"];
	}
}