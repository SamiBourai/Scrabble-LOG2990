import { TestBed } from '@angular/core/testing';
import { A, B, E, L, R, T, U } from '@app/constants/constants';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { LettersService } from './letters.service';
//  import { Letter } from '@app/classes/letter';
//  import { Easel } from '@app/classes/easel';
//import { ReserveService } from './reserve.service';



fdescribe('EaselLogiscticsService', () => {
    let service: EaselLogiscticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EaselLogiscticsService);
        const width = 15;
        const height = 25;
        // eslint-disable-next-line -- createCanvas is private and we need access for the test
        service.gridContext = CanvasTestHelper.createCanvas(width, height).getContext('2d') as CanvasRenderingContext2D;

    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  // test placeEaselLetters
  it('test place letter, Should set all the element of occupiedPos to true',()=>{
    service.occupiedPos= [false, false, false, false, false, false, false];
    service.placeEaselLetters();
    for(let i=0; i<6;i++){
        expect(service.occupiedPos[i]).toEqual(false);
    }
  });

// test deletLetterFromEasel()
  it('test delete letter from the Easel, occupiedPos should be false after delete',()=>{
    service.occupiedPos= [false, true, false, false, false, false, false];
    service.easelLetters[1].index=1;
    service.deleteletterFromEasel(service.easelLetters[1]);
    expect(service.occupiedPos[1]).toEqual(false);
  });
 // test isFull()
  it('Array of position is empty, isFull should return false',()=>{
    service.occupiedPos= [false, false, false, false, false, false, false];
    expect(service.isFull()).toBeFalsy();
  });


  it('Array of position is full, isFull should return true',()=>{
    service.occupiedPos= [true, true, true, true, true, true, true];
    expect(service.isFull()).toBeTruthy();
  });

  // test getLetterFromEasel
  it('should return A by default letter because easel is all empty',()=>{
    service.occupiedPos= [false, false, false, false, false, false, false];
    expect(service.getLetterFromEasel(0)).toEqual(A);;
  });

  it('should return a letter from the easel and call clearRect to clear the letter from the Easel and set the occupied index to false after the clearing',()=>{
    service.occupiedPos= [true, true, true, true, true, true, true];
    service.easelLetters[0].index=0;
    service.easelLetters[0].letters=B;
    const clearRectSpy = spyOn(service.gridContext, 'clearRect').and.callThrough();
    expect(service.getLetterFromEasel(0)).toEqual(B);
    expect(clearRectSpy).toHaveBeenCalled();

  });

  it('test word (Bruttale) in Easel, all (Brutale) letter are thr easel, wordInEasel expected to return True',()=>{
    service.foundLetter=[false,false,false,false,false,false,false];
    service.easelLetters= [
        { index: 0, letters: B },
        { index: 1, letters: R },
        { index: 2, letters: U },
        { index: 3, letters: T },
        { index: 4, letters: A },
        { index: 5, letters: L },
        { index: 6, letters: E },
    ];

    expect(service.wordInEasel('brutale')).toEqual(true)



  });


  it('test word (Abattre) in Easel, those letters are not in the Easel, wordInEasel expected to return false',()=>{
    service.foundLetter=[false,false,false,false,false,false,false];
    service.easelLetters= [
        { index: 0, letters: B },
        { index: 1, letters: R },
        { index: 2, letters: U },
        { index: 3, letters: T },
        { index: 4, letters: A },
        { index: 5, letters: L },
        { index: 6, letters: E },
    ];

    expect(service.wordInEasel('abattre')).toEqual(false);

  });

});
