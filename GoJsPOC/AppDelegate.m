//
//  AppDelegate.m
//  GoJsPOC
//
//  Created by Rusmin Susanto on 20/10/2015.
//  Copyright (c) 2015 Rusmin Susanto. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate ()
@property (weak) IBOutlet NSImageView *icon;

@property (nonatomic, weak) IBOutlet NSWindow *window;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
	[_window setFrame:NSMakeRect(0, 0, 1280, 800) display:YES];

	// Insert code here to initialize your application
	NSString *resourcesPath = [[NSBundle mainBundle] resourcePath];
	NSString *htmlPath = [resourcesPath stringByAppendingString:@"/hello.html"];
	NSString *urlAddress = [NSString stringWithFormat:@"file://%@", htmlPath];
	NSURL *url = [NSURL URLWithString:urlAddress];
	NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
	[[_webView mainFrame] loadRequest:requestObj];
}

- (void)applicationWillTerminate:(NSNotification *)aNotification
{
	// Insert code here to tear down your application
}

@end
