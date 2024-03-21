/*
  MIT License

  Copyright © 2023 Alex Høffner

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
  and associated documentation files (the “Software”), to deal in the Software without
  restriction, including without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
  BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { FormList } from './FormList';
import { EventType, MenuComponent, MenuEvent } from 'futureforms';

export class Menu extends MenuComponent
{
	private displayed:boolean = false;
	private folder:HTMLElement = null;
	private menuelem:HTMLElement = null;
	private container:HTMLElement = null;

	constructor()
	{
		super("left-menu",new FormList(),{openroot: true, multipleOpen: true});

		this.menuelem = document.createElement("div");
		this.menuelem.classList.value = "left-menu-container";

		this.container = document.getElementById("main-menu") as HTMLElement;

		this.menuelem = this.container.appendChild(this.menuelem);
		this.target = this.menuelem;


		this.addEventListener(this.hideSideBar,{type: EventType.WhenMenuBlur})
		this.addEventListener(this.showSideBar,{type: EventType.WhenMenuFocus})

		super.show();
	}

	public async showSideBar(event:MenuEvent) : Promise<boolean>
	{
		if (event.menu != this)
			return(true);

		this.displayed = true;

		this.folder?.classList.add("active");
		this.container.style.minWidth = "185px";
		this.container.classList.add("menu-left-open");

		return(true);
	}

	public async hideSideBar(event:MenuEvent) : Promise<boolean>
	{
		if (event.menu != this)
			return(true);

		this.displayed = false;
		this.folder?.classList.remove("active");
		this.container.style.minWidth = "0px";
		this.container.classList.remove("menu-left-open");

		return(true);
	}

	public async togglemenu() : Promise<boolean>
	{

		this.folder = document.querySelector(".left-menu-container li") as HTMLElement;
		if (this.displayed)
		{
			this.folder?.classList.remove("active");
			this.container.style.minWidth = "0px";
			this.container.classList.remove("menu-left-open");
		}
		else
		{

			this.folder?.classList.add("active");
			this.container.style.minWidth = "185px";
			this.container.classList.add("menu-left-open");
		}

		this.displayed = !this.displayed;
		return(true);
	}
}