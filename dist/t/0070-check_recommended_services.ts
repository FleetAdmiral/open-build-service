#!/usr/bin/env perl

use strict;
use warnings;
use Test::More 'tests' => 6;

my $max_wait = 300;

my @daemons = qw/obsdodup obssigner obsdeltastore/;

foreach my $srv (@daemons) {
	my @state=`systemctl is-enabled $srv\.service 2>/dev/null`;
	chomp($state[0]);
	is($state[0],"enabled","Checking if recommended service $srv is enabled");
}

my %srv_state=();

while ($max_wait > 0) {
	
	foreach my $srv (@daemons) {
		my @state=`systemctl is-active $srv\.service 2>/dev/null`;
		chomp($state[0]);
		if ( $state[0] eq 'active') {
			$srv_state{$srv} = 'active';
		}
	}
	if ( keys(%srv_state) == scalar(@daemons) ) {
		last;
	}
	$max_wait--;
	sleep 1;
}

foreach my $srv ( @daemons ) {
	is($srv_state{$srv} || 'timeout','active',"Checking recommended service '$srv' status");
}


exit 0;
