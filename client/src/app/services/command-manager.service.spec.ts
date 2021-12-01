/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/easel-object';
import { CommandManagerService } from './command-manager.service';

fdescribe('CommandManagerService', () => {
    let service: CommandManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(CommandManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('verifyExchangeCommand', () => {
        const reserveSize = 4;
        const easel = new EaselObject(true);
        const lettersToSwap = 'ae';
        expect(service.verifyExchageCommand(reserveSize, easel, lettersToSwap)).toBeFalse();
    });

    it('verifyExchangeCommand reserve > 7', () => {
        const reserveSize = 20;
        const easel = new EaselObject(true);
        const lettersToSwap = 'ae';
        spyOn<any>(service['lettersService'], 'changeLetterFromReserve').and.returnValue(true);

        expect(service.verifyExchageCommand(reserveSize, easel, lettersToSwap)).toBeTrue();
    });

    it('verifyExchangeCommand reserve > 7 else', () => {
        const reserveSize = 20;
        const easel = new EaselObject(true);
        const lettersToSwap = 'ae';
        spyOn<any>(service['lettersService'], 'changeLetterFromReserve').and.returnValue(false);

        expect(service.verifyExchageCommand(reserveSize, easel, lettersToSwap)).toBeFalse();
    });

    it('validateWord', () => {
        const playMode = 'soloGame';
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        const spy1 = spyOn<any>(service, 'verifyWordsInDictionnary');
        service.validateWord(cmd, playMode, 'allo');
        expect(spy1).toHaveBeenCalled();
    });

    it('validateWord else', () => {
        const playMode = 'Game';
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        const spy1 = spyOn<any>(service['socketManagementService'], 'emit');
        service.validateWord(cmd, playMode, 'allo');
        expect(spy1).toHaveBeenCalled();
    });

    it('verifyCommand', () => {
        const easel = new EaselObject(true);
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(service, 'isWordInBoardLimits').and.returnValue(true);
        spyOn<any>(service['lettersService'], 'tileIsEmpty').and.returnValue(true);
        spyOn<any>(service, 'validFirstPosition').and.returnValue(true);
        spyOn<any>(service, 'isInEasel').and.returnValue(true);
        service.verifyCommand(cmd, easel);
        expect(service.verifyCommand(cmd, easel)).toBeTrue();
    });

    it('verifyCommand else', () => {
        const easel = new EaselObject(true);
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(service, 'isWordInBoardLimits').and.returnValue(true);
        spyOn<any>(service['lettersService'], 'tileIsEmpty').and.returnValue(false);
        spyOn<any>(service, 'isPlacableWord').and.returnValue(true);
        spyOn<any>(service, 'isWordAttachedToTheBoard').and.returnValue(true);
        service.verifyCommand(cmd, easel);
        expect(service.verifyCommand(cmd, easel)).toBeTrue();
    });

    it('verifyCommand else false', () => {
        const easel = new EaselObject(true);
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(service, 'isWordInBoardLimits').and.returnValue(false);

        service.verifyCommand(cmd, easel);
        expect(service.verifyCommand(cmd, easel)).toBeFalse();
    });

    it('verifyCommand 48-51', () => {
        const easel = new EaselObject(true);
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(service, 'isWordInBoardLimits').and.returnValue(true);
        spyOn<any>(service['lettersService'], 'tileIsEmpty').and.returnValue(true);
        spyOn<any>(service, 'validFirstPosition').and.returnValue(false);
        spyOn<any>(service, 'isInEasel').and.returnValue(false);
        spyOn<any>(service, 'isPlacableWord').and.returnValue(true);
        spyOn<any>(service, 'isWordAttachedToTheBoard').and.returnValue(true);
        service.verifyCommand(cmd, easel);
        expect(service.verifyCommand(cmd, easel)).toBeFalse();
    });

    

    it('verifyWordsInDictionnary',()=>{
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        const playMode = 'Game';
        spyOn<any>(service['validWordService'], 'readWordsAndGivePointsIfValid').and.returnValue(2);
        spyOn<any>(service['validWordService'], 'verifyWord').and.returnValue(true);
        service.verifyWordsInDictionnary(cmd,playMode);
        expect(service.wordIsValid).toBeTrue();

    });

    it('verifyWordsInDictionnary switch',()=>{
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        const playMode = 'Game';
        spyOn<any>(service['validWordService'], 'readWordsAndGivePointsIfValid').and.returnValue(0);
        spyOn<any>(service['validWordService'], 'verifyWord').and.returnValue(true);
        service.verifyWordsInDictionnary(cmd,playMode);
        expect(service.errorMessage).toBe('les mots engendrés par votre placement ne sont pas dans le dictionnaire');

    });

    it('verifyWordsInDictionnary default',()=>{
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        const playMode = 'Game';
        spyOn<any>(service['validWordService'], 'readWordsAndGivePointsIfValid').and.returnValue(0);
        spyOn<any>(service['validWordService'], 'verifyWord').and.returnValue(false);
        service.verifyWordsInDictionnary(cmd,playMode);
        expect(service.errorMessage).toBe("votre mot n'est pas contenue dans le dictionnaire");

    });

    it('isWordInBoardLimits',()=>{
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(service['lettersService'], 'wordInBoardLimits').and.returnValue(true);
        expect(service['isWordInBoardLimits'](cmd)).toBeTrue();

    });

    it('isWordInBoardLimits else',()=>{
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(service['lettersService'], 'wordInBoardLimits').and.returnValue(false);
        expect(service['isWordInBoardLimits'](cmd)).toBeFalse();

    });

    it('validFirstPosition',()=>{
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        expect(service['validFirstPosition'](cmd)).toBeTrue();
    });

    it('validFirstPosition else',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        expect(service['validFirstPosition'](cmd)).toBeFalse();
    });

    it('isInEasel',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        const easel = new EaselObject(true);
        spyOn<any>(easel,'contains').and.returnValue(true);
        expect(service['isInEasel'](cmd,easel)).toBeTrue();
    });

    it('isInEasel else',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        const easel = new EaselObject(true);
        spyOn<any>(easel,'contains').and.returnValue(false);
        expect(service['isInEasel'](cmd,easel)).toBeFalse();
    });

    it('isWordAttachedToTheBoard',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        spyOn<any>(service['lettersService'],'wordIsAttached').and.returnValue(true);
        expect(service['isWordAttachedToTheBoard'](cmd)).toBeTrue();
    });

    it('isWordAttachedToTheBoard else',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        spyOn<any>(service['lettersService'],'wordIsAttached').and.returnValue(false);
        expect(service['isWordAttachedToTheBoard'](cmd)).toBeFalse();
    });

    it('isPlacableWord',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        const easel = new EaselObject(true);
        spyOn<any>(service['lettersService'],'wordIsPlacable').and.returnValue(true);
        expect(service['isPlacableWord'](cmd,easel)).toBeTrue();
    });

    it('isPlacableWord',()=>{
        const cmd = { word: 'mot', position: { x: 6, y: 8 }, direction: 'h' };
        const easel = new EaselObject(true);
        spyOn<any>(service['lettersService'],'wordIsPlacable').and.returnValue(false);
        expect(service['isPlacableWord'](cmd,easel)).toBeFalse();
    });


});
