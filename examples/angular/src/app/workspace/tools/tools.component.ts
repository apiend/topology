import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Store } from 'le5le-store';

import { ToolsService } from './tools.service';
import { Tools } from './tools';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
  providers: [ToolsService]
})
export class ToolsComponent implements OnInit, OnDestroy {
  @Output() edit = new EventEmitter<any>();

  search = '';
  tab = 1;

  classes: any[];
  topoTools: any[];

  systemTools: any[] = Tools;
  userTools: any[] = [];

  search$ = new Subject<string>();
  classes$: any;

  user: any;
  user$: any;
  constructor(private service: ToolsService) {
  }

  async ngOnInit() {
    this.user$ = Store.subscribe('user', async (user: any) => {
      this.user = user;

      if (user) {
        this.topoTools = await this.service.GetUserTools();
        this.userTools = [];
        this.classifyTools(this.topoTools, this.userTools);
      }
    });

    this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(text => {
        this.onSearch(text);
      });

    this.classes$ = Store.subscribe('app-classes', (classes: any) => {
      if (!classes) {
        return;
      }
      this.classes = Object.assign([], classes);
      this.userTools = [];
      this.classifyTools(this.topoTools, this.userTools);
    });
  }

  classifyTools(tools: any[], list: any[]) {
    if (!this.classes || !tools || !list) {
      return;
    }

    for (const c of this.classes) {
      const menu = {
        name: c.name,
        list: [],
        expand: true
      };
      for (const item of tools) {
        if (item.class === c.name) {
          menu.list.push(item);
        }
      }
      list.push(menu);
    }
  }

  onSearch(text: string) {
    this.filterTools(this.systemTools, text);
    this.filterTools(this.userTools, text);
  }

  filterTools(tools: any[], text: string) {
    for (const group of tools) {
      let found = false;
      for (const item of group.list) {
        item.hidden = false;
        if (!text) {
          found = true;
          continue;
        }
        if (item.name.indexOf(text) > -1 || item.py.indexOf(text) > -1) {
          found = true;
        } else {
          item.hidden = true;
        }
      }

      if (found) {
        group.expand = true;
      } else {
        group.expand = false;
      }
    }
  }

  onDrag(event: DragEvent, node: any) {
    if (node) {
      event.dataTransfer.setData('Text', JSON.stringify(node.componentData || node.data));
    }
  }

  onTouchstart(item: any) {
    // this.canvas.touchedNode = item.data;
  }

  onEditComponent(name: string, id: string = '') {
    this.edit.emit({
      id,
      name
    });
  }

  ngOnDestroy() {
    this.search$.unsubscribe();
    this.classes$.unsubscribe();
    this.user$.unsubscribe();
  }
}
