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

import { BaseForm } from './BaseForm';
import { Minimized } from './Minimized';

import { Template } from './tags/Template';


import { PageHeader } from './fragments/PageHeader';
import { PageFooter } from './fragments/PageFooter';
import { CanvasHeader } from './fragments/CanvasHeader';

import { Menu as TopMenu } from './menus/topmenu/Menu';
import { Menu as LeftMenu } from './menus/leftmenu/Menu';

import { KeyMapPage, FormsPathMapping, FormsModule as FormsCoreModule, FlushStrategy, KeyMap, FormEvent, EventType, DatabaseConnection as Connection, FormProperties, UsernamePassword, Form, AlertForm, InternalFormsConfig, ConnectionScope } from 'futureforms';
import { Test1 } from './forms/generated/Test1';
import { Test } from './forms/generated/Test';
import { Employee } from './forms/generated/Employee';
import { Department } from './forms/generated/Department';





@FormsPathMapping(
	[
		{class: PageFooter, path: "/html/pagefooter"},
		{class: PageHeader, path: "/html/pageheader"},
		{class: CanvasHeader, path: "/html/canvasheader"},
	
	]
)

export class FormsModule extends FormsCoreModule
{
	public topmenu:TopMenu = null;
	public leftmenu:LeftMenu = null;

	public list:Minimized = null;
	public static DATABASE:Connection = null;
    

	constructor()
	{
		super();

		// Be aware of FormProperties
		FormProperties.DateFormat = "DD-MM-YYYY";

		// Be aware of InternalFormsConfig
		InternalFormsConfig.CloseButtonText = "&#215;";

		// Demo custom tag
		FormProperties.TagLibrary.set("Template",Template);
	
		// Set root element for forms and parse the document
		FormsModule.setRootElement(document.body.querySelector("#forms"));
		this.parse();

		// Minimized window list
		this.list = new Minimized();

		// Menues
		this.topmenu = new TopMenu();
		this.leftmenu = new LeftMenu();

		// Update the keymapping
		FormsModule.updateKeyMap(keymap);

		// Stateful timeout
		Connection.TRXTIMEOUT = 240;
		Connection.CONNTIMEOUT = 120;

		// Stateful lock limit
		Connection.MAXLOCKS = 16;

		// Setup connection
		FormsModule.DATABASE = new Connection("http://localhost:9002");
		FormsModule.DATABASE.scope = ConnectionScope.dedicated;

		// Communicate when validating row or block
		FormsModule.defaultFlushStrategy = FlushStrategy.Block;

		// Add shortcut information page
		let infomation:HTMLElement = document.querySelector(".infomation");
		infomation.appendChild(KeyMapPage.show(keymap));

		// Add shortcuts for login, close, and menues
		this.addEventListener(this.close,{type: EventType.Key, key: keymap.close});
		this.addEventListener(this.login,{type: EventType.Key, key: keymap.login});

		this.addEventListener(this.showTopMenu,{type: EventType.Key, key: keymap.topmenu});
		this.addEventListener(this.showLeftMenu,{type: EventType.Key, key: keymap.leftmenu});



		// Direct url navigation
		//FormsModule.OpenURLForm();
		// FormsModule.showform(Test1);
		// FormsModule.showform(Test);
		FormsModule.showform(Department);
		
	}
    
	
	private logontrg:object = null;
	public async login() : Promise<boolean>
	{
		let usrpwd:Form = await FormsModule.showform(UsernamePassword);
		this.logontrg = this.addFormEventListener(usrpwd,this.connect,{type: EventType.OnCloseForm});
		return(true);
	}

	public async logout() : Promise<boolean>
	{
		if (!FormsModule.DATABASE.connected())
			return(true);

		let forms:Form[] = FormsModule.getRunningForms();

		for (let i = 0; i < forms.length; i++)
		{
			if (!await forms[i].clear())
				return(false);
		}

		return(FormsModule.DATABASE.disconnect());
	}

	public async close() : Promise<boolean>
	{
		let form:Form = FormsModule.getCurrentForm();
		if (form != null) return(form.close());
		return(true);
	}

	private async connect(event:FormEvent) : Promise<boolean>
	{
		let form:UsernamePassword = event.form as UsernamePassword;
		FormsModule.removeEventListener(this.logontrg);

		if (form.accepted && form.username && form.password)
		{
			if (!await FormsModule.DATABASE.connect(form.username,form.password))
			{
				await FormsModule.sleep(2000);

				let forms:Form[] = FormsModule.getRunningForms();

				for (let i = 0; i < forms.length; i++)
				{
					if (forms[i] instanceof AlertForm)
						await forms[i].close(true);
				}

				this.login();
				return(true);
			}

			BaseForm.connectNeddle();
		}

		return(true);
	}

	public async showTopMenu() : Promise<boolean>
	{
		this.topmenu.focus();
		return(true);
	}

	public async showLeftMenu() : Promise<boolean>
	{
		this.leftmenu.focus();
		return(true);
	}
}

export class keymap extends KeyMap
{
	public static close:KeyMap = new KeyMap({key: 'w', ctrl: true},"close","close window");
	public static login:KeyMap = new KeyMap({key: 'l', ctrl: true},"login","show login form");
	public static topmenu:KeyMap = new KeyMap({key: 'm', ctrl: true},"top-menu","go to top menu");
	public static leftmenu:KeyMap = new KeyMap({key: 'f', ctrl: true},"left-menu","go to left menu");
}