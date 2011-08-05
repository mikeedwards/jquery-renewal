describe('jquery-renewal', function () {
  var 
    calculateElementWidth = function (el) {
      var marginLeft = parseInt(el.css('marginLeft'), 10),
          marginRight = parseInt(el.css('marginRight'), 10);
      return el.outerWidth() + marginLeft + marginRight;
    };

  describe('Default configuration', function () {

    describe('jQuery element', function () {
      beforeEach(function () {
        loadFixtures('fixture.html');
        this.element = $('#carousel');
        this.element.renewal();
      });

      it('should have a carousel data key', function () {
        expect(this.element).toHaveData('carousel');
      });

      it('should have the carousel object in data', function () {
        var carousel = this.element.data('carousel');
        expect(typeof carousel).toBe('object'); 
      });

      it('should establish the parent element as a wrapper', function () {
        var defaultWrapperClass = 'renewal-carousel-container',
            wrapper = this.element.parent();
        expect(wrapper).toHaveClass(defaultWrapperClass);
      });

      it('should constrain the width of the wrapper', function () {
        var firstItem = this.element.children(':first'),
            wrapper = this.element.parent(),
            firstItemWidth = calculateElementWidth(firstItem);
        expect(wrapper.width()).toEqual(firstItemWidth);
      });

      it('should change the width of the element', function () {
        var items = this.element.children(),
            itemWidth = 0;
        items.each(function (i, el) {
          itemWidth += calculateElementWidth($(el));
        });
        expect(this.element.width()).toEqual(itemWidth);
      });

      it('should set the position of the element to relative', function () {
        expect(this.element.css('position')).toEqual('relative');
      });

      it('should set the left position to the starting point', function () {
        expect(this.element.css('left')).toEqual('0px');
      });

      describe('Renewal', function () {
        beforeEach(function () {
          this.carousel = this.element.data('carousel');
        });

        it("should have a length equal to the element's children", function () {
          expect(this.carousel.length).toEqual(this.element.children().length);
        });


        it('should have a size method that returns the length', function () {
          expect(this.carousel.size()).toEqual(this.element.children().length);
        });

        it('should know the current position of the carousel', function () {
          expect(this.carousel.getPosition()).toEqual(0);
        });

        describe('#moveTo', function () {
          it('should move to a specific position', function () {
            var renewal = this.carousel.moveTo(1)
            expect(renewal.getPosition()).toEqual(1);
          });

          it('should move the left position of the element', function () {
            this.carousel.moveTo(2);
            expect(this.element.css('left')).toEqual('-140px');
          });

          it('should be chaninable', function () {
            expect(this.carousel.moveTo(1)).toEqual(this.carousel);
          });

          it('should not move beyond the lower boundary of the list', function () {
            var movement = this.carousel.moveTo(-2);
            expect(movement.getPosition()).not.toEqual(-2);
          });

          it('should not move beyond the upper boundary of the list', function () {
            var movement = this.carousel.moveTo(5);
            expect(movement.getPosition()).not.toEqual(5);
          });
        });

        describe('#advance', function () {
          afterEach(function () {
            this.carousel.moveTo(0);
          });

          it('should update the position of the carousel by one item', function () {
            this.carousel.advance();
            expect(this.carousel.getPosition()).toEqual(1);
          });

          it('should update the left position of the element', function () {
            var firstItem = this.element.children(':first'),
                firstItemWidth = calculateElementWidth(firstItem);
            this.carousel.advance();
            expect(this.element.css('left')).toEqual('-' + firstItemWidth + 'px');
          });

          it('should advance two positions', function () {
            this.carousel.advance(2);
            expect(this.carousel.getPosition()).toEqual(2);
          });

          it('should advance the left position by two item widths', function () {
            var firstItem = this.element.children(':first'),
                secondItem = this.element.children().eq(1),
                firstItemWidth = calculateElementWidth(firstItem);
                secondItemWidth = calculateElementWidth(secondItem);
            this.carousel.advance(2);
            expect(this.element.css('left')).toEqual('-' + (firstItemWidth + secondItemWidth) + 'px');
          });

          it('should not advance beyond the upper boundary', function () {
            this.carousel.advance(5);
            expect(this.carousel.getPosition()).toEqual(2);
          });

          it('should move backwards when given a negative step', function () {
            this.carousel.advance(2);
            this.carousel.advance(-1);
            expect(this.carousel.getPosition()).toEqual(1);
          });

          it('should not move beyond the lower boundary', function () {
            this.carousel.advance(2);
            this.carousel.advance(-5);
            expect(this.carousel.getPosition()).toEqual(0);
          });

        });

      });

    });

  });

});
