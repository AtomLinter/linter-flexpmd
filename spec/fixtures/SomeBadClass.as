package {
   class SomeBadClass extends AnotherClass {
      private var someVariable:Number

      public function someMethod(someParameter:Number = 4):void {
         var someLocalVariable:Number = someParameter * (2 + someVariable);
      }
   }
}
