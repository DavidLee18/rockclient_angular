import { Component, OnInit } from '@angular/core';
import { RockService } from 'src/app/rock.service';
import { basicRouteNames } from 'src/app/app-routing.module';
import { retreatRouteNames } from '../retreat-routing.module';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

interface Node {
  value: string;
  children?: Node[];
}

interface TreeNode {
  control: NestedTreeControl<Node>;
  data: Node[];
}

interface Stat {
  period: string;
  first: TreeNode;
  second: TreeNode;
  third: TreeNode;
  fourth?: TreeNode;
}

const mockData: Node[] = [
  { value: '8/12 점심: 100', children: [
    { value: '대학로: 10', children: [
      { value: '김성락' },
      { value: '나진환' },
      { value: '홍길동' },
    ] },
    { value: '서바다: 12' },
    { value: '남서울: 11' },
  ] },
];

@Component({
  selector: 'app-retreat.statistics',
  templateUrl: './retreat-statistics.component.html',
  styleUrls: ['./retreat-statistics.component.css']
})
export class RetreatStatisticsComponent implements OnInit {
  loggedIn: boolean
  readonly routes = basicRouteNames.concat(retreatRouteNames);
  control = () => new NestedTreeControl<Node>(node => node.children);
  readonly stats: Stat[] = [
    { 
      period: '아침', 
      first: { control: this.control(), data: mockData }, 
      second: { control: this.control(), data: mockData }, 
      third: { control: this.control(), data: mockData }, 
      fourth: { control: this.control(), data: mockData }
    },
    { 
      period: '점심', 
      first: { control: this.control(), data: mockData }, 
      second: { control: this.control(), data: mockData }, 
      third: { control: this.control(), data: mockData }, 
      fourth: { control: this.control(), data: mockData }
    },
    { 
      period: '저녁', 
      first: { control: this.control(), data: mockData }, 
      second: { control: this.control(), data: mockData }, 
      third: { control: this.control(), data: mockData }, 
      fourth: { control: this.control(), data: mockData }
    },
  ];
  readonly mockData = mockData;

  constructor(private _service: RockService) {}

  ngOnInit() {
    this._service.loggedIn.subscribe((l) => { this.loggedIn = l; });
  }

  logout = () => this._service.logout();
  hasChild = (_, node: Node) => !!node.children && node.children.length > 0;
}
