window.Shortly=Backbone.View.extend({template:Templates.layout,events:{"click li a.index":"renderIndexView","click li a.create":"renderCreateView"},initialize:function(){console.log("Shortly is running"),$("body").append(this.render().el),this.router=new Shortly.Router({el:this.$el.find("#container")}),this.router.on("route",this.updateNav,this),Backbone.history.start({pushState:!0})},render:function(){return this.$el.html(this.template()),this},renderIndexView:function(e){e&&e.preventDefault(),this.router.navigate("/",{trigger:!0})},renderCreateView:function(e){e&&e.preventDefault(),this.router.navigate("/create",{trigger:!0})},updateNav:function(routeName){this.$el.find(".navigation li a").removeClass("selected").filter("."+routeName).addClass("selected")}}),Shortly.createLinkView=Backbone.View.extend({className:"creator",template:Templates.create,events:{submit:"shortenUrl"},render:function(){return this.$el.html(this.template()),this},shortenUrl:function(e){e.preventDefault();var $form=this.$el.find("form .text"),link=new Shortly.Link({url:$form.val()});link.on("request",this.startSpinner,this),link.on("sync",this.success,this),link.on("error",this.failure,this),link.save({}),$form.val("")},success:function(link){this.stopSpinner();var view=new Shortly.LinkView({model:link});this.$el.find(".message").append(view.render().$el.hide().fadeIn())},failure:function(model){return this.stopSpinner(),console.log(model),this.$el.find(".message").html("Please enter a valid URL").addClass("error"),this},startSpinner:function(){this.$el.find("img").show(),this.$el.find("form input[type=submit]").attr("disabled","true"),this.$el.find(".message").html("").removeClass("error")},stopSpinner:function(){this.$el.find("img").fadeOut("fast"),this.$el.find("form input[type=submit]").attr("disabled",null),this.$el.find(".message").html("").removeClass("error")}}),Shortly.Link=Backbone.Model.extend({urlRoot:"/links"}),Shortly.LinkView=Backbone.View.extend({className:"link",template:Templates.link,render:function(){return this.$el.html(this.template(this.model.attributes)),console.log(this.model),this}}),Shortly.Links=Backbone.Collection.extend({model:Shortly.Link,url:"/links"}),Shortly.LinksView=Backbone.View.extend({className:"links",initialize:function(){this.collection.on("sync",this.addAll,this),this.collection.fetch()},render:function(){return this.$el.empty(),this},addAll:function(){this.collection.forEach(this.addOne,this)},addOne:function(item){var view=new Shortly.LinkView({model:item});this.$el.append(view.render().el)}}),Shortly.Router=Backbone.Router.extend({initialize:function(options){this.$el=options.el},routes:{"":"index",create:"create"},swapView:function(view){this.$el.html(view.render().el)},index:function(){var links=new Shortly.Links,linksView=new Shortly.LinksView({collection:links});this.swapView(linksView)},create:function(){this.swapView(new Shortly.createLinkView)}});