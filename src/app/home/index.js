import {View} from 'backbone';
import $ from 'jquery';
import {HomeView, ListAccountView} from './tpl';
import Accounts from './../collections/Accounts';
import Account from './../models/Account';
import createRootNode from 'virtual-dom/create-element';
import Rx from 'rx';

export default class Home extends View {
  constructor(route){
    super();
    this.route = route;
  }
  tagName() {
    return 'div';
  }
  el() {
    return '#wrapper';
  }
  events(){

    return {
      'click #accountSave button': 'submit',
      'click a.goto-account': 'gotoAccount'
    };
  }
  gotoAccount(e){
    e.preventDefault();
    this.route.navigate(e.currentTarget.getAttribute('href'), {trigger:true, replace: true});
    return false;
  }
  submit(e){
    e.preventDefault();
    const accountName = $('form input:eq(0)').val();
    const account = new Account({name: accountName});
    account.save();
    this.accounts.add(account);
    return false;

  }
  initialize() {
    this.$el.empty();
    this.accounts = new Accounts();
    this.listenTo(this.accounts, 'reset', this.renderAccounts);
    this.accounts.on('add', this.renderAccounts, this);
    this.accounts.fetch();
    this.render();
    this.listView = ListAccountView(this.$el);
  }
  renderAccounts(){
    this.listView(this.accounts);
  }
  render() {
    const node =  HomeView(this.$el);
    node();
    const el = this;
    this.$el.append(createRootNode(node));
    const input = document.getElementById('twitterAccount');
    Rx.Observable.fromEvent(input, 'keyup')
    .map((e)=>e.currentTarget.value)
    .map((input)=>/^@?([a-zA-Z0-9_]){1,15}$/.test(input))
    .distinctUntilChanged()
    .subscribe(
      (result)=>{
        node(!result);
      },
      (err)=>{
        logError(err);
      }
    );
    return this;
  }
}
