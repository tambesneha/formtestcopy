
import { Filter, Filters, ListOfValues } from "futureforms";
import { TestDS as DataSource } from '../datasources/TestDS';


export class Test1 extends ListOfValues
{
	public title:string = "Test1";

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